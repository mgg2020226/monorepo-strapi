import process from 'node:process';

import pg from 'pg';

const { Client } = pg;

if (typeof process.loadEnvFile === 'function') {
  process.loadEnvFile();
}

function env(name, fallback = '') {
  return process.env[name] ?? fallback;
}

async function fetchStatus(url) {
  const signal = AbortSignal.timeout(5000);
  const headResponse = await fetch(url, { method: 'HEAD', signal });
  if (headResponse.status !== 405) {
    return headResponse.status;
  }

  const getResponse = await fetch(url, {
    method: 'GET',
    headers: { Range: 'bytes=0-0' },
    signal,
  });

  return getResponse.status;
}

async function main() {
  const baseUrl = env('MEDIA_AUDIT_BASE_URL', env('PUBLIC_URL')).replace(/\/+$/, '');
  if (!baseUrl) {
    throw new Error('MEDIA_AUDIT_BASE_URL or PUBLIC_URL is required');
  }

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

  await client.connect();

  try {
    const { rows } = await client.query(`
      SELECT id, name, url
      FROM files
      WHERE url IS NOT NULL
        AND url <> ''
      ORDER BY id ASC
    `);

    const missing = [];
    const chunkSize = 8;

    for (let index = 0; index < rows.length; index += chunkSize) {
      const chunk = rows.slice(index, index + chunkSize);

      const results = await Promise.all(
        chunk.map(async (row) => {
          const assetUrl = new URL(row.url, `${baseUrl}/`).toString();

          try {
            const status = await fetchStatus(assetUrl);
            return status >= 200 && status < 400
              ? null
              : { id: row.id, name: row.name, url: row.url, status };
          } catch (error) {
            return {
              id: row.id,
              name: row.name,
              url: row.url,
              status: error instanceof Error ? error.name : 'ERROR',
            };
          }
        })
      );

      for (const result of results) {
        if (result) {
          missing.push(result);
        }
      }
    }

    const summary = {
      ok: missing.length === 0,
      baseUrl,
      totalFiles: rows.length,
      missingCount: missing.length,
      missing,
    };

    if (missing.length > 0) {
      console.error(JSON.stringify(summary, null, 2));
      process.exitCode = 1;
      return;
    }

    console.log(JSON.stringify(summary, null, 2));
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error('[upload-coverage-audit] fatal:', error);
  process.exitCode = 1;
});
