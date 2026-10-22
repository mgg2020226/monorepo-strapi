import process from 'node:process';

import pg from 'pg';

const { Client } = pg;

if (typeof process.loadEnvFile === 'function') {
  process.loadEnvFile();
}

const FILE_ID_MAP = new Map([
  [66, 41],
  [69, 40],
  [81, 45],
  [82, 51],
  [83, 52],
  [85, 52],
  [88, 54],
  [89, 47],
  [90, 44],
  [93, 52],
  [126, 40],
  [130, 46],
  [131, 51],
  [132, 44],
  [134, 50],
  [135, 44],
  [137, 50],
  [138, 54],
  [139, 55],
]);

function env(name, fallback = '') {
  return process.env[name] ?? fallback;
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

function buildUpdateStatement(fileColumns, sourceRow) {
  const editableColumns = [
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

  const assignments = editableColumns.map(
    (column, index) => `${column} = $${index + 1}`
  );
  const values = editableColumns.map((column) => sourceRow[column] ?? null);

  return {
    sql: `
      UPDATE files
      SET ${assignments.join(', ')}
      WHERE id = $${editableColumns.length + 1}
    `,
    values,
  };
}

async function getFileRow(client, fileId) {
  const result = await client.query('SELECT * FROM files WHERE id = $1', [fileId]);
  return result.rows[0] ?? null;
}

async function main() {
  const targetDatabase = env('DATABASE_NAME');
  const sourceDatabase = env('LEGACY_MEDIA_SOURCE_DATABASE', 'mappdiffusion');

  if (!targetDatabase) {
    throw new Error('DATABASE_NAME is required');
  }

  const connectionConfig = {
    host: env('DATABASE_HOST', '127.0.0.1'),
    port: Number(env('DATABASE_PORT', '5432')),
    user: env('DATABASE_USERNAME'),
    password: env('DATABASE_PASSWORD'),
    ssl: env('DATABASE_SSL', 'false') === 'true' ? { rejectUnauthorized: false } : false,
  };

  const targetClient = new Client({
    ...connectionConfig,
    database: targetDatabase,
  });

  const sourceClient = new Client({
    ...connectionConfig,
    database: sourceDatabase,
  });

  await targetClient.connect();
  await sourceClient.connect();

  try {
    const fileColumns = await getTableColumnSet(targetClient, 'files');
    let updated = 0;

    for (const [targetFileId, sourceFileId] of FILE_ID_MAP.entries()) {
      const sourceRow = await getFileRow(sourceClient, sourceFileId);
      if (!sourceRow) {
        throw new Error(`source file ${sourceFileId} not found in ${sourceDatabase}`);
      }

      const targetRow = await getFileRow(targetClient, targetFileId);
      if (!targetRow) {
        throw new Error(`target file ${targetFileId} not found in ${targetDatabase}`);
      }

      const statement = buildUpdateStatement(fileColumns, sourceRow);
      await targetClient.query(statement.sql, [...statement.values, targetFileId]);
      updated += 1;

      console.log(
        `[legacy-media-migration] target ${targetFileId} now points to media from source ${sourceFileId}`
      );
    }

    console.log(`[legacy-media-migration] completed updated=${updated}`);
  } finally {
    await targetClient.end();
    await sourceClient.end();
  }
}

main().catch((error) => {
  console.error('[legacy-media-migration] fatal:', error);
  process.exitCode = 1;
});
