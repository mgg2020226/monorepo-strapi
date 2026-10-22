import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import pg from 'pg';

const { Client } = pg;

const RESOLUTION_UID = 'api::resolution.resolution';
const RESOLUTION_DOCUMENT_FIELD = 'document';

const MONTHS = new Map([
  ['ENERO', 1],
  ['ENE', 1],
  ['FEBRERO', 2],
  ['FEB', 2],
  ['MARZO', 3],
  ['MAR', 3],
  ['ABRIL', 4],
  ['ABR', 4],
  ['MAYO', 5],
  ['MAY', 5],
  ['JUNIO', 6],
  ['JUN', 6],
  ['JULIO', 7],
  ['JUL', 7],
  ['AGOSTO', 8],
  ['AGO', 8],
  ['SEPTIEMBRE', 9],
  ['SETIEMBRE', 9],
  ['SEP', 9],
  ['OCTUBRE', 10],
  ['OCT', 10],
  ['NOVIEMBRE', 11],
  ['NOV', 11],
  ['DICIEMBRE', 12],
  ['DIC', 12],
]);

if (typeof process.loadEnvFile === 'function') {
  process.loadEnvFile();
}

function env(name, fallback = '') {
  return process.env[name] ?? fallback;
}

function isDryRun() {
  return env('RESOLUTION_DATE_BACKFILL_DRY_RUN') === 'true';
}

function getBaseUrl() {
  return (
    env('RESOLUTION_DATE_SOURCE_BASE_URL') ||
    env('MEDIA_AUDIT_BASE_URL') ||
    env('STRAPI_PUBLIC_URL') ||
    ''
  )
    .trim()
    .replace(/\/+$/, '');
}

function normalizeText(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[“”"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}

function parseIsoDate(year, month, day) {
  const parsedYear = Number.parseInt(year, 10);
  const parsedMonth = Number.parseInt(month, 10);
  const parsedDay = Number.parseInt(day, 10);

  if (
    !Number.isInteger(parsedYear) ||
    !Number.isInteger(parsedMonth) ||
    !Number.isInteger(parsedDay) ||
    parsedMonth < 1 ||
    parsedMonth > 12 ||
    parsedDay < 1 ||
    parsedDay > 31
  ) {
    return null;
  }

  return `${parsedYear.toString().padStart(4, '0')}-${parsedMonth
    .toString()
    .padStart(2, '0')}-${parsedDay.toString().padStart(2, '0')}`;
}

function extractCandidateDates(text, fallbackYear) {
  const candidates = [];

  for (const match of text.matchAll(/\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/g)) {
    const isoDate = parseIsoDate(match[3], match[2], match[1]);
    if (isoDate) {
      candidates.push(isoDate);
    }
  }

  for (const match of text.matchAll(
    /\b([0O]?\s*\d{1,2})\s+DE\s+([A-Z]{3,12})\s+DE\s+(\d{4})\b/g
  )) {
    const dayToken = match[1].replace(/\s+/g, '').replace(/^O/, '0');
    const monthToken = match[2].replace(/\s+/g, '');
    const yearToken = match[3];
    const month = MONTHS.get(monthToken);

    if (month) {
      const isoDate = parseIsoDate(yearToken, String(month), dayToken);
      if (isoDate) {
        candidates.push(isoDate);
      }
    }
  }

  for (const match of text.matchAll(
    /\(\s*([0O]?\s*\d{1,2})\s+([A-Z]{3,12})\s+(\d{4})\s*\)/g
  )) {
    const dayToken = match[1].replace(/\s+/g, '').replace(/^O/, '0');
    const monthToken = match[2].replace(/\s+/g, '');
    const yearToken = match[3];
    const month = MONTHS.get(monthToken);

    if (month) {
      const isoDate = parseIsoDate(yearToken, String(month), dayToken);
      if (isoDate) {
        candidates.push(isoDate);
      }
    }
  }

  if (fallbackYear) {
    for (const match of text.matchAll(/\(\s*([0O]?\s*\d{1,2})\s+DE\s+([A-Z]{3,12})\s*\)/g)) {
      const dayToken = match[1].replace(/\s+/g, '').replace(/^O/, '0');
      const monthToken = match[2].replace(/\s+/g, '');
      const month = MONTHS.get(monthToken);

      if (month) {
        const isoDate = parseIsoDate(String(fallbackYear), String(month), dayToken);
        if (isoDate) {
          candidates.push(isoDate);
        }
      }
    }
  }

  return candidates;
}

function chooseCandidate(candidates, fallbackYear) {
  if (candidates.length === 0) {
    return null;
  }

  if (fallbackYear) {
    const exactYear = candidates.find((candidate) => candidate.startsWith(`${fallbackYear}-`));
    if (exactYear) {
      return exactYear;
    }
  }

  return candidates[0];
}

function extractResolutionDate({ title, text, fallbackYear }) {
  const normalizedTitle = normalizeText(title);
  const titleDate = chooseCandidate(
    extractCandidateDates(normalizedTitle, fallbackYear),
    fallbackYear
  );
  if (titleDate) {
    return titleDate;
  }

  const normalizedText = normalizeText(text);
  const topTextDate = chooseCandidate(
    extractCandidateDates(normalizedText.slice(0, 900), fallbackYear),
    fallbackYear
  );
  if (topTextDate) {
    return topTextDate;
  }

  return chooseCandidate(extractCandidateDates(normalizedText.slice(0, 2500), fallbackYear), fallbackYear);
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function loadPdfBytes(sourceUrl) {
  if (!sourceUrl) {
    throw new Error('missing source URL');
  }

  if (/^https?:\/\//i.test(sourceUrl)) {
    const response = await fetch(sourceUrl);
    if (!response.ok) {
      throw new Error(`fetch failed with status ${response.status}`);
    }

    return new Uint8Array(await response.arrayBuffer());
  }

  const relativePath = sourceUrl.startsWith('/') ? sourceUrl.slice(1) : sourceUrl;
  const localPath = path.resolve(process.cwd(), 'public', relativePath);

  if (await fileExists(localPath)) {
    return new Uint8Array(await readFile(localPath));
  }

  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    throw new Error(
      `could not resolve ${sourceUrl} locally and RESOLUTION_DATE_SOURCE_BASE_URL is not set`
    );
  }

  const response = await fetch(`${baseUrl}${sourceUrl.startsWith('/') ? sourceUrl : `/${sourceUrl}`}`);
  if (!response.ok) {
    throw new Error(`fetch failed with status ${response.status}`);
  }

  return new Uint8Array(await response.arrayBuffer());
}

async function extractFirstPageText(pdfBytes) {
  const loadingTask = pdfjsLib.getDocument({
    data: pdfBytes,
    isEvalSupported: false,
    useWorkerFetch: false,
  });

  const pdf = await loadingTask.promise;

  try {
    const page = await pdf.getPage(1);
    const text = await page.getTextContent();
    return text.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ');
  } finally {
    await loadingTask.destroy();
  }
}

async function getResolutionRows(client) {
  const result = await client.query(
    `
      SELECT
        r.id,
        r.title,
        r.date,
        r.year,
        r.published_at,
        f.url AS document_url
      FROM resolutions r
      LEFT JOIN files_related_mph fr
        ON fr.related_id = r.id
       AND fr.related_type = $1
       AND fr.field = $2
      LEFT JOIN files f
        ON f.id = fr.file_id
      WHERE f.url IS NOT NULL
      ORDER BY r.id ASC
    `,
    [RESOLUTION_UID, RESOLUTION_DOCUMENT_FIELD]
  );

  return result.rows;
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
    const rows = await getResolutionRows(client);
    const dryRun = isDryRun();

    console.log(
      `[resolution-date-backfill] checking ${rows.length} resolution(s)${dryRun ? ' (dry-run)' : ''}`
    );

    let updated = 0;
    let unchanged = 0;
    let failed = 0;

    for (const row of rows) {
      try {
        const pdfBytes = await loadPdfBytes(row.document_url);
        const firstPageText = await extractFirstPageText(pdfBytes);
        const parsedDate = extractResolutionDate({
          title: row.title,
          text: firstPageText,
          fallbackYear: row.year,
        });

        if (!parsedDate) {
          failed += 1;
          console.error(
            `[resolution-date-backfill] unable to parse date for ${row.id} "${row.title}"`
          );
          continue;
        }

        if (row.date && parsedDate === row.date.toISOString().slice(0, 10)) {
          unchanged += 1;
          continue;
        }

        if (!dryRun) {
          await client.query('UPDATE resolutions SET date = $1 WHERE id = $2', [
            parsedDate,
            row.id,
          ]);
        }

        updated += 1;
        console.log(
          `[resolution-date-backfill] ${dryRun ? 'would update' : 'updated'} resolution ${
            row.id
          } -> ${parsedDate}`
        );
      } catch (error) {
        failed += 1;
        console.error(
          `[resolution-date-backfill] failed resolution ${row.id}: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }

    console.log(
      `[resolution-date-backfill] completed updated=${updated} unchanged=${unchanged} failed=${failed}`
    );
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error('[resolution-date-backfill] fatal:', error);
  process.exitCode = 1;
});
