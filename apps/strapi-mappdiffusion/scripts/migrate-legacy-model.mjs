import { spawnSync } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const scriptDir = path.resolve(process.cwd(), 'scripts');

const steps = [
  {
    label: 'legacy-text-encoding-fix',
    file: path.join(scriptDir, 'fix-legacy-text-encoding.mjs'),
  },
  {
    label: 'resolution-document-migration',
    file: path.join(scriptDir, 'migrate-resolution-documents.mjs'),
  },
  {
    label: 'resolution-date-backfill',
    file: path.join(scriptDir, 'backfill-resolution-dates.mjs'),
  },
  {
    label: 'navigation-link-migration',
    file: path.join(scriptDir, 'migrate-navigation-links.mjs'),
  },
  {
    label: 'legacy-media-migration',
    file: path.join(scriptDir, 'migrate-legacy-media.mjs'),
  },
];

for (const step of steps) {
  console.log(`[legacy-model-migration] starting ${step.label}`);

  const result = spawnSync(process.execPath, [step.file], {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    console.error(
      `[legacy-model-migration] ${step.label} failed with exit code ${result.status ?? 1}`
    );
    process.exit(result.status ?? 1);
  }
}

console.log('[legacy-model-migration] completed');
