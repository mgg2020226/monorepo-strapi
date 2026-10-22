import { createHash } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import pg from 'pg';
import awsS3Provider from '@strapi/provider-upload-aws-s3';

const { Client } = pg;
const IMAGE_EXTENSIONS = new Map([
  ['image/jpeg', new Set(['.jpg', '.jpeg'])],
  ['image/png', new Set(['.png'])],
]);
const PROJECT_ROOT = process.cwd();
const UPLOADS_DIR = path.resolve(PROJECT_ROOT, 'public', 'uploads');
const STATE_DIR = path.resolve(PROJECT_ROOT, '.tmp');

if (typeof process.loadEnvFile === 'function') {
  process.loadEnvFile();
}

function env(name, fallback = '') {
  return process.env[name] ?? fallback;
}

function isDryRun() {
  return env('MIGRATE_IMAGE_MEDIA_DRY_RUN', 'true') !== 'false';
}

function getRequiredEnv(name) {
  const value = env(name).trim();
  if (!value) throw new Error(`${name} is required`);
  return value;
}

function createDatabaseClient() {
  return new Client({
    host: getRequiredEnv('DATABASE_HOST'),
    port: Number(env('DATABASE_PORT', '5432')),
    database: getRequiredEnv('DATABASE_NAME'),
    user: getRequiredEnv('DATABASE_USERNAME'),
    password: getRequiredEnv('DATABASE_PASSWORD'),
    ssl: env('DATABASE_SSL', 'false') === 'true' ? { rejectUnauthorized: false } : false,
    application_name: 'mappdiffusion-image-s3-migration',
  });
}

function createS3Provider() {
  const acl = env('AWS_ACL', 'private');
  const params = {
    Bucket: getRequiredEnv('AWS_BUCKET'),
    signedUrlExpires: Number(env('AWS_SIGNED_URL_EXPIRES', '900')),
  };

  if (acl === 'none') params.ACL = undefined;
  else params.ACL = acl;

  return awsS3Provider.init({
    rootPath: env('AWS_ROOT_PATH', 'mappdiffusion'),
    s3Options: {
      credentials: {
        accessKeyId: getRequiredEnv('AWS_ACCESS_KEY_ID'),
        secretAccessKey: getRequiredEnv('AWS_ACCESS_SECRET'),
      },
      region: getRequiredEnv('AWS_REGION'),
      forcePathStyle: env('AWS_FORCE_PATH_STYLE', 'false') === 'true',
      params,
    },
  });
}

async function listRelatedLocalImages(client) {
  await client.query('BEGIN READ ONLY');
  try {
    const result = await client.query(
      `
        SELECT f.id, f.name, f.hash, f.ext, f.mime, f.size,
               f.url, f.provider, f.provider_metadata
        FROM files AS f
        WHERE lower(f.mime) = ANY($1::text[])
          AND f.provider = 'local'
          AND EXISTS (
            SELECT 1 FROM files_related_mph AS fr WHERE fr.file_id = f.id
          )
        ORDER BY f.id ASC
      `,
      [[...IMAGE_EXTENSIONS.keys()]]
    );
    return result.rows;
  } finally {
    await client.query('ROLLBACK');
  }
}

async function getLocalImage(file) {
  const mime = String(file.mime).toLowerCase();
  const supportedExtensions = IMAGE_EXTENSIONS.get(mime);
  if (!supportedExtensions) throw new Error(`unsupported image MIME type ${mime}`);

  const ext = String(file.ext || '').toLowerCase();
  if (!supportedExtensions.has(ext)) {
    throw new Error(`extension ${ext || '(none)'} does not match ${mime}`);
  }
  if (typeof file.url !== 'string' || !file.url.trim()) {
    throw new Error('file row has no local URL');
  }

  const pathname = new URL(file.url, 'http://strapi.local').pathname;
  const normalizedPath = decodeURIComponent(pathname).replaceAll('\\', '/');
  if (!normalizedPath.startsWith('/uploads/')) {
    throw new Error('file URL is outside the local uploads directory');
  }

  const filename = path.posix.basename(normalizedPath);
  if (!filename || filename === '.' || filename === '..') {
    throw new Error('file URL has no safe filename');
  }

  const localPath = path.resolve(UPLOADS_DIR, filename);
  if (!localPath.startsWith(`${UPLOADS_DIR}${path.sep}`)) {
    throw new Error('resolved file path is outside the local uploads directory');
  }

  const buffer = await readFile(localPath);
  const validSignature = mime === 'image/jpeg'
    ? buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff
    : buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (!validSignature) throw new Error(`local file signature does not match ${mime}`);

  return { buffer, localPath };
}

function providerFile(file, buffer) {
  const ext = String(file.ext || '').toLowerCase();
  return {
    name: file.name,
    hash: file.hash,
    ext,
    mime: String(file.mime).toLowerCase(),
    size: Number(file.size),
    sizeInBytes: buffer.length,
    buffer,
  };
}

async function writeManifest(filePath, manifest) {
  const tempPath = `${filePath}.tmp`;
  await writeFile(tempPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  await rename(tempPath, filePath);
}

async function verifyPublicUrl(url, expectedSize) {
  const response = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`public S3 URL check returned HTTP ${response.status}`);

  const contentLength = Number(response.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength !== expectedSize) {
    throw new Error('public S3 URL returned an unexpected content length');
  }
}

async function updateFileRow(client, oldFile, url) {
  await client.query('BEGIN');
  try {
    const result = await client.query(
      `
        UPDATE files
        SET url = $1, provider = 'aws-s3', updated_at = NOW()
        WHERE id = $2
          AND provider = 'local'
          AND url = $3
          AND lower(mime) = $4
        RETURNING id
      `,
      [url, oldFile.id, oldFile.url, String(oldFile.mime).toLowerCase()]
    );

    if (result.rowCount !== 1) {
      throw new Error('file row changed during migration; no metadata was updated');
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  }
}

async function migrateOneImage(client, provider, row, manifestEntry) {
  const { buffer } = await getLocalImage(row);
  const file = providerFile(row, buffer);
  let uploadedByThisRun = false;
  const objectAlreadyExisted = await provider.objectExists(file);

  if (objectAlreadyExisted) {
    const metadata = await provider.getObjectMetadata(file);
    const sourceMd5 = createHash('md5').update(buffer).digest('hex');
    if (metadata.contentLength !== buffer.length || metadata.etag !== sourceMd5) {
      throw new Error('an S3 object already exists at the target key with different content');
    }
  }

  try {
    const imageAcl = env('MIGRATE_IMAGE_MEDIA_ACL', 'public-read');
    try {
      await provider.upload(file, { ACL: imageAcl });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!/bucket does not allow ACLs|AccessControlListNotSupported/i.test(message)) throw error;

      // ACL-disabled buckets need a bucket policy to provide public reads.
      await provider.upload(file, { ACL: undefined });
      manifestEntry.accessMode = 'bucket-policy';
    }
    uploadedByThisRun = true;

    if (!file.url || !/^https:\/\//i.test(file.url)) {
      throw new Error('S3 provider did not return a valid HTTPS URL');
    }

    const metadata = await provider.getObjectMetadata(file);
    if (metadata.contentLength !== buffer.length || metadata.contentType !== file.mime) {
      throw new Error('uploaded S3 object failed metadata verification');
    }
    await verifyPublicUrl(file.url, buffer.length);

    await updateFileRow(client, row, file.url);
    manifestEntry.status = 'migrated';
    manifestEntry.newUrl = file.url;
    await writeManifest(manifestPath, activeManifest);
  } catch (error) {
    if (uploadedByThisRun && !objectAlreadyExisted) {
      try {
        await provider.delete(file);
      } catch (cleanupError) {
        console.error(
          `[image-s3-migration] cleanup failed for file ${row.id}: ${cleanupError instanceof Error ? cleanupError.message : String(cleanupError)}`
        );
      }
    }
    throw error;
  }
}

let activeManifest;
let manifestPath;

async function main() {
  const dryRun = isDryRun();
  const client = createDatabaseClient();
  await client.connect();

  try {
    const rows = await listRelatedLocalImages(client);
    const prepared = [];
    const failures = [];

    for (const row of rows) {
      try {
        const image = await getLocalImage(row);
        prepared.push({ row, sizeInBytes: image.buffer.length });
      } catch (error) {
        failures.push({ id: row.id, error: error instanceof Error ? error.message : String(error) });
      }
    }

    console.log(
      `[image-s3-migration] eligible=${rows.length} validLocalImages=${prepared.length} invalid=${failures.length}${dryRun ? ' (dry-run, no writes)' : ''}`
    );
    for (const failure of failures) {
      console.error(`[image-s3-migration] skipped file ${failure.id}: ${failure.error}`);
    }
    if (dryRun || rows.length === 0) return;

    const provider = createS3Provider();
    const timestamp = new Date().toISOString().replaceAll(':', '-');
    await mkdir(STATE_DIR, { recursive: true });
    manifestPath = path.join(STATE_DIR, `image-s3-migration-${timestamp}.json`);
    activeManifest = {
      createdAt: new Date().toISOString(),
      bucket: getRequiredEnv('AWS_BUCKET'),
      rootPath: env('AWS_ROOT_PATH', 'mappdiffusion'),
      scope: 'related local image/jpeg and image/png files',
      objectAccess: env('MIGRATE_IMAGE_MEDIA_ACL', 'public-read'),
      entries: prepared.map(({ row, sizeInBytes }) => ({
        id: row.id,
        name: row.name,
        hash: row.hash,
        ext: row.ext,
        mime: row.mime,
        sizeInBytes,
        oldUrl: row.url,
        oldProvider: row.provider,
        oldProviderMetadata: row.provider_metadata,
        status: 'pending',
      })),
    };
    await writeManifest(manifestPath, activeManifest);
    console.log(`[image-s3-migration] recovery manifest written to ${path.relative(PROJECT_ROOT, manifestPath)}`);

    const rowsById = new Map(prepared.map(({ row }) => [row.id, row]));
    let migrated = 0;
    let failed = 0;
    for (const entry of activeManifest.entries) {
      const row = rowsById.get(entry.id);
      if (!row) continue;
      try {
        await migrateOneImage(client, provider, row, entry);
        migrated += 1;
        console.log(`[image-s3-migration] migrated file ${entry.id}`);
      } catch (error) {
        failed += 1;
        entry.status = 'failed';
        entry.error = error instanceof Error ? error.message : String(error);
        await writeManifest(manifestPath, activeManifest);
        console.error(`[image-s3-migration] failed file ${entry.id}: ${entry.error}`);
      }
    }

    console.log(
      `[image-s3-migration] completed migrated=${migrated} failed=${failed} manifest=${path.relative(PROJECT_ROOT, manifestPath)}`
    );
    if (failed > 0) process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error('[image-s3-migration] fatal:', error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
