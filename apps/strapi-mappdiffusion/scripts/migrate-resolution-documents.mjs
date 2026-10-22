import { randomBytes } from 'node:crypto';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import pg from 'pg';

const { Client } = pg;

const RESOLUTION_UID = 'api::resolution.resolution';
const RESOLUTION_DOCUMENT_FIELD = 'document';

if (typeof process.loadEnvFile === 'function') {
  process.loadEnvFile();
}

function env(name, fallback = '') {
  return process.env[name] ?? fallback;
}

function isDryRun() {
  return env('MIGRATE_RESOLUTION_DOCUMENTS_DRY_RUN') === 'true';
}

function getLimit() {
  const raw = env('MIGRATE_RESOLUTION_DOCUMENTS_LIMIT');
  if (!raw) return null;

  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function sanitizeFilenameSegment(value) {
  return value
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .toLowerCase()
    .slice(0, 80);
}

function buildFilename(resolution) {
  const base = sanitizeFilenameSegment(resolution.title) || `resolution-${resolution.id}`;
  return `${base}.pdf`;
}

function buildHash(resolution) {
  const base = sanitizeFilenameSegment(resolution.title) || `resolution-${resolution.id}`;
  return `${base}_${randomBytes(5).toString('hex')}`;
}

function buildDocumentId() {
  return randomBytes(12).toString('hex');
}

function looksLikePdf(contentType, url) {
  return Boolean(
    contentType?.toLowerCase().includes('pdf') ||
      url.toLowerCase().includes('.pdf')
  );
}

async function queryOne(client, sql, params = []) {
  const result = await client.query(sql, params);
  return result.rows[0] ?? null;
}

async function getTableColumnSet(client, tableName) {
  const result = await client.query(
    `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = $1
      ORDER BY ordinal_position
    `,
    [tableName]
  );

  return new Set(result.rows.map((row) => row.column_name));
}

async function getPendingResolutions(client) {
  const limit = getLimit();
  const params = [RESOLUTION_UID, RESOLUTION_DOCUMENT_FIELD];
  let sql = `
    SELECT r.id, r.title, r.link
    FROM resolutions r
    LEFT JOIN files_related_mph fr
      ON fr.related_id = r.id
     AND fr.related_type = $1
     AND fr.field = $2
    WHERE r.link IS NOT NULL
      AND r.link <> ''
      AND fr.id IS NULL
    ORDER BY r.id ASC
  `;

  if (limit) {
    params.push(limit);
    sql += ` LIMIT $${params.length}`;
  }

  const result = await client.query(sql, params);
  return result.rows;
}

function buildFileInsertStatement(fileColumns, valuesByColumn) {
  const orderedColumns = [
    'document_id',
    'name',
    'alternative_text',
    'caption',
    'width',
    'height',
    'formats',
    'hash',
    'ext',
    'mime',
    'size',
    'url',
    'preview_url',
    'provider',
    'provider_metadata',
    'folder_path',
    'created_at',
    'updated_at',
    'published_at',
    'created_by_id',
    'updated_by_id',
    'locale',
    'focal_point',
  ].filter((column) => fileColumns.has(column));

  const values = orderedColumns.map((column) => valuesByColumn[column] ?? null);
  const placeholders = orderedColumns.map((_, index) => `$${index + 1}`);

  return {
    sql: `
      INSERT INTO files (${orderedColumns.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING id
    `,
    values,
  };
}

async function migrateResolution(client, uploadsDir, fileColumns, resolution) {
  const response = await fetch(resolution.link);
  if (!response.ok) {
    throw new Error(`fetch failed with status ${response.status}`);
  }

  const contentType = response.headers.get('content-type');
  if (!looksLikePdf(contentType, resolution.link)) {
    throw new Error(`response is not a PDF (${contentType || 'unknown content-type'})`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length === 0) {
    throw new Error('downloaded file is empty');
  }

  const filename = buildFilename(resolution);
  const hash = buildHash(resolution);
  const ext = path.extname(filename) || '.pdf';
  const uploadFilename = `${hash}${ext}`;
  const uploadPath = path.join(uploadsDir, uploadFilename);
  const uploadUrl = `/uploads/${uploadFilename}`;
  const now = new Date();
  const sizeInKb = Number((buffer.length / 1000).toFixed(2));

  await writeFile(uploadPath, buffer);

  try {
    await client.query('BEGIN');

    const fileInsertStatement = buildFileInsertStatement(fileColumns, {
      document_id: buildDocumentId(),
      name: filename,
      alternative_text: null,
      caption: null,
      width: null,
      height: null,
      formats: null,
      hash,
      ext,
      mime: contentType || 'application/pdf',
      size: sizeInKb,
      url: uploadUrl,
      preview_url: null,
      provider: 'local',
      provider_metadata: null,
      folder_path: '/',
      created_at: now,
      updated_at: now,
      published_at: now,
      created_by_id: null,
      updated_by_id: null,
      locale: null,
      focal_point: null,
    });

    const fileInsert = await client.query(fileInsertStatement.sql, fileInsertStatement.values);

    const fileId = fileInsert.rows[0]?.id;
    if (!fileId) {
      throw new Error('failed to insert file row');
    }

    await client.query(
      `
        INSERT INTO files_related_mph (file_id, related_id, related_type, field, "order")
        VALUES ($1, $2, $3, $4, NULL)
      `,
      [fileId, resolution.id, RESOLUTION_UID, RESOLUTION_DOCUMENT_FIELD]
    );

    await client.query('UPDATE resolutions SET link = NULL WHERE id = $1', [resolution.id]);
    await client.query('COMMIT');

    return { fileId, uploadUrl };
  } catch (error) {
    await client.query('ROLLBACK');
    await rm(uploadPath, { force: true });
    throw error;
  }
}

async function main() {
  const client = new Client({
    host: env('DATABASE_HOST', '127.0.0.1'),
    port: Number(env('DATABASE_PORT', '5432')),
    database: env('DATABASE_NAME'),
    user: env('DATABASE_USERNAME'),
    password: env('DATABASE_PASSWORD'),
    ssl: env('DATABASE_SSL', 'false') === 'true' ? { rejectUnauthorized: false } : false,
  });

  if (!env('DATABASE_NAME')) {
    throw new Error('DATABASE_NAME is required');
  }

  const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');
  await mkdir(uploadsDir, { recursive: true });

  await client.connect();

  try {
    const linkColumn = await queryOne(
      client,
      `
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'resolutions'
          AND column_name = 'link'
      `
    );

    if (!linkColumn) {
      console.log('[resolution-document-migration] resolutions.link is absent, nothing to migrate');
      return;
    }

    const pendingResolutions = await getPendingResolutions(client);
    const fileColumns = await getTableColumnSet(client, 'files');
    const dryRun = isDryRun();

    console.log(
      `[resolution-document-migration] ${pendingResolutions.length} pending resolution(s)${dryRun ? ' (dry-run)' : ''}`
    );

    if (pendingResolutions.length === 0) {
      return;
    }

    let migrated = 0;
    let failed = 0;

    for (const resolution of pendingResolutions) {
      if (dryRun) {
        console.log(
          `[resolution-document-migration] dry-run id=${resolution.id} link=${resolution.link}`
        );
        continue;
      }

      try {
        const result = await migrateResolution(client, uploadsDir, fileColumns, resolution);
        migrated += 1;
        console.log(
          `[resolution-document-migration] migrated resolution ${resolution.id} -> file ${result.fileId} (${result.uploadUrl})`
        );
      } catch (error) {
        failed += 1;
        console.error(
          `[resolution-document-migration] failed resolution ${resolution.id}: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }

    console.log(
      `[resolution-document-migration] completed migrated=${migrated} failed=${failed}`
    );
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error('[resolution-document-migration] fatal:', error);
  process.exitCode = 1;
});
