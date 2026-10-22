import process from 'node:process';

import pg from 'pg';

const { Client } = pg;

const SUSPICIOUS_CHARS = [
  String.fromCodePoint(0x00c3),
  String.fromCodePoint(0x00c2),
  String.fromCodePoint(0x00e2),
  String.fromCodePoint(0xfffd),
];
const SUSPICIOUS_REGEX = new RegExp(`[${SUSPICIOUS_CHARS.join('')}]`);
const SUSPICIOUS_SQL_PATTERN = `[${SUSPICIOUS_CHARS.join('')}]`;

const WINDOWS_1252_MAP = new Map([
  [0x20ac, 0x80],
  [0x201a, 0x82],
  [0x0192, 0x83],
  [0x201e, 0x84],
  [0x2026, 0x85],
  [0x2020, 0x86],
  [0x2021, 0x87],
  [0x02c6, 0x88],
  [0x2030, 0x89],
  [0x0160, 0x8a],
  [0x2039, 0x8b],
  [0x0152, 0x8c],
  [0x017d, 0x8e],
  [0x2018, 0x91],
  [0x2019, 0x92],
  [0x201c, 0x93],
  [0x201d, 0x94],
  [0x2022, 0x95],
  [0x2013, 0x96],
  [0x2014, 0x97],
  [0x02dc, 0x98],
  [0x2122, 0x99],
  [0x0161, 0x9a],
  [0x203a, 0x9b],
  [0x0153, 0x9c],
  [0x017e, 0x9e],
  [0x0178, 0x9f],
]);

if (typeof process.loadEnvFile === 'function') {
  process.loadEnvFile();
}

function env(name, fallback = '') {
  return process.env[name] ?? fallback;
}

function suspiciousScore(value) {
  return [...value].filter((char) => SUSPICIOUS_CHARS.includes(char)).length;
}

function decodeMojibake(value, encoding) {
  if (encoding === 'latin1') {
    return Buffer.from(value, 'latin1').toString('utf8').normalize('NFC');
  }

  const bytes = [];
  for (const char of value) {
    const codePoint = char.codePointAt(0);
    const mappedByte =
      codePoint !== undefined && WINDOWS_1252_MAP.has(codePoint)
        ? WINDOWS_1252_MAP.get(codePoint)
        : codePoint;

    if (mappedByte === undefined || mappedByte > 0xff) {
      return null;
    }

    bytes.push(mappedByte);
  }

  return Buffer.from(bytes).toString('utf8').normalize('NFC');
}

function repairText(value) {
  if (!SUSPICIOUS_REGEX.test(value)) {
    return null;
  }

  const candidates = ['latin1', 'windows1252']
    .map((encoding) => decodeMojibake(value, encoding))
    .filter((candidate) => Boolean(candidate) && !candidate.includes(String.fromCodePoint(0xfffd)));

  const repaired = candidates.sort(
    (left, right) => suspiciousScore(left) - suspiciousScore(right)
  )[0];

  if (!repaired || repaired === value) {
    return null;
  }

  if (suspiciousScore(repaired) >= suspiciousScore(value)) {
    return null;
  }

  return repaired;
}

function repairJson(value) {
  if (typeof value === 'string') {
    return repairText(value) ?? value;
  }

  if (Array.isArray(value)) {
    let changed = false;
    const repaired = value.map((item) => {
      const next = repairJson(item);
      changed ||= next !== item;
      return next;
    });

    return changed ? repaired : value;
  }

  if (value && typeof value === 'object') {
    let changed = false;
    const repaired = {};

    for (const [key, item] of Object.entries(value)) {
      const next = repairJson(item);
      changed ||= next !== item;
      repaired[key] = next;
    }

    return changed ? repaired : value;
  }

  return value;
}

async function getRepairableColumns(client) {
  const result = await client.query(`
    SELECT table_name, column_name, udt_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND (
        data_type IN ('character varying', 'text')
        OR udt_name IN ('json', 'jsonb')
      )
    ORDER BY table_name, ordinal_position
  `);

  return result.rows;
}

async function getPrimaryKeyColumns(client, tableName) {
  const result = await client.query(
    `
      SELECT a.attname AS column_name
      FROM pg_index i
      JOIN pg_attribute a
        ON a.attrelid = i.indrelid
       AND a.attnum = ANY(i.indkey)
      WHERE i.indrelid = $1::regclass
        AND i.indisprimary
      ORDER BY array_position(i.indkey, a.attnum)
    `,
    [`public.${tableName}`]
  );

  return result.rows.map((row) => row.column_name);
}

function quoteIdentifier(value) {
  return `"${value.replaceAll('"', '""')}"`;
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

  await client.connect();

  try {
    const columns = await getRepairableColumns(client);
    let updatedRows = 0;

    for (const { table_name: tableName, column_name: columnName, udt_name: udtName } of columns) {
      const primaryKeyColumns = await getPrimaryKeyColumns(client, tableName);
      if (primaryKeyColumns.length === 0) {
        continue;
      }

      const selectColumns = [...primaryKeyColumns, columnName].map(quoteIdentifier).join(', ');
      const tableIdentifier = quoteIdentifier(tableName);
      const columnIdentifier = quoteIdentifier(columnName);

      const candidates = await client.query(
        `
          SELECT ${selectColumns}
          FROM ${tableIdentifier}
          WHERE ${columnIdentifier} IS NOT NULL
            AND ${columnIdentifier}::text ~ $1
        `,
        [SUSPICIOUS_SQL_PATTERN]
      );

      for (const row of candidates.rows) {
        const original = row[columnName];
        const repaired =
          udtName === 'json' || udtName === 'jsonb'
            ? repairJson(original)
            : repairText(original);

        if (!repaired || repaired === original) {
          continue;
        }

        const whereClause = primaryKeyColumns
          .map((column, index) => `${quoteIdentifier(column)} = $${index + 2}`)
          .join(' AND ');
        const whereValues = primaryKeyColumns.map((column) => row[column]);
        const isJsonColumn = udtName === 'json' || udtName === 'jsonb';
        const updateValue = isJsonColumn ? JSON.stringify(repaired) : repaired;
        const updateCast = isJsonColumn ? `::${udtName}` : '';

        await client.query(
          `UPDATE ${tableIdentifier} SET ${columnIdentifier} = $1${updateCast} WHERE ${whereClause}`,
          [updateValue, ...whereValues]
        );

        updatedRows += 1;
        console.log(
          `[legacy-text-encoding] fixed ${tableName}.${columnName} (${primaryKeyColumns
            .map((column) => `${column}=${row[column]}`)
            .join(', ')})`
        );
      }
    }

    console.log(`[legacy-text-encoding] completed updated=${updatedRows}`);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error('[legacy-text-encoding] fatal:', error);
  process.exitCode = 1;
});
