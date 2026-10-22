import type { Core } from '@strapi/strapi';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import nodemailer from 'nodemailer';
import os from 'node:os';
import path from 'node:path';

const RESOLUTION_UID = 'api::resolution.resolution';
const RESOLUTION_DOCUMENT_FIELD = 'document';

type LegacyResolutionRow = {
  id: number;
  title: string;
  link: string;
};

function isResolutionDocumentMigrationEnabled() {
  return process.env.MIGRATE_RESOLUTION_DOCUMENTS === 'true';
}

function isResolutionDocumentMigrationDryRun() {
  return process.env.MIGRATE_RESOLUTION_DOCUMENTS_DRY_RUN === 'true';
}

function getResolutionDocumentMigrationLimit() {
  const raw = process.env.MIGRATE_RESOLUTION_DOCUMENTS_LIMIT;
  if (!raw) return null;

  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function sanitizeFilenameSegment(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .toLowerCase()
    .slice(0, 80);
}

function buildResolutionFilename(resolution: LegacyResolutionRow) {
  const base = sanitizeFilenameSegment(resolution.title) || `resolution-${resolution.id}`;
  return `${base}.pdf`;
}

function looksLikePdf(contentType: string | null, url: string) {
  return Boolean(
    contentType?.toLowerCase().includes('pdf') ||
      url.toLowerCase().includes('.pdf')
  );
}

async function listLegacyResolutionRows(strapi: Core.Strapi) {
  const linkColumnExists = await strapi.db.connection('information_schema.columns')
    .where({
      table_schema: 'public',
      table_name: 'resolutions',
      column_name: 'link',
    })
    .first();

  if (!linkColumnExists) {
    strapi.log.info(
      '[resolution-document-migration] skipping bootstrap migration because resolutions.link is absent'
    );
    return [];
  }

  const query = strapi.db.connection('resolutions as r')
    .leftJoin('files_related_mph as fr', function joinResolutionDocument() {
      this.on('fr.related_id', '=', 'r.id')
        .andOn(
          'fr.related_type',
          '=',
          strapi.db.connection.raw('?', [RESOLUTION_UID])
        )
        .andOn(
          'fr.field',
          '=',
          strapi.db.connection.raw('?', [RESOLUTION_DOCUMENT_FIELD])
        );
    })
    .select<LegacyResolutionRow[]>('r.id', 'r.title', 'r.link')
    .whereNotNull('r.link')
    .where('r.link', '<>', '')
    .whereNull('fr.id')
    .orderBy('r.id', 'asc');

  const limit = getResolutionDocumentMigrationLimit();
  if (limit) {
    query.limit(limit);
  }

  return query;
}

async function clearLegacyResolutionLink(strapi: Core.Strapi, id: number) {
  await strapi.db.connection('resolutions').where({ id }).update({ link: null });
}

async function migrateResolutionDocument(
  strapi: Core.Strapi,
  resolution: LegacyResolutionRow
) {
  const response = await fetch(resolution.link);

  if (!response.ok) {
    throw new Error(`fetch failed with status ${response.status}`);
  }

  const contentType = response.headers.get('content-type');
  if (!looksLikePdf(contentType, resolution.link)) {
    throw new Error(`response is not a PDF (${contentType || 'unknown content-type'})`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (buffer.length === 0) {
    throw new Error('downloaded file is empty');
  }

  const tmpDir = await mkdtemp(path.join(os.tmpdir(), 'resolution-migration-'));
  const filename = buildResolutionFilename(resolution);
  const tmpPath = path.join(tmpDir, filename);

  try {
    await writeFile(tmpPath, buffer);

    const apiUploadFolder = await strapi
      .plugin('upload')
      .service('api-upload-folder')
      .getAPIUploadFolder();

    const uploadedFiles = await strapi.plugin('upload').service('upload').upload({
      data: {
        refId: resolution.id,
        ref: RESOLUTION_UID,
        field: RESOLUTION_DOCUMENT_FIELD,
        fileInfo: {
          name: filename,
          folder: apiUploadFolder.id,
        },
      },
      files: {
        filepath: tmpPath,
        originalFilename: filename,
        mimetype: contentType || 'application/pdf',
        size: buffer.length,
      },
    });

    const uploadedFile = uploadedFiles[0];
    if (!uploadedFile?.id) {
      throw new Error('upload service returned no file');
    }

    await clearLegacyResolutionLink(strapi, resolution.id);
    return uploadedFile;
  } finally {
    await rm(tmpDir, { recursive: true, force: true });
  }
}

async function migrateLegacyResolutionDocuments(strapi: Core.Strapi) {
  if (!isResolutionDocumentMigrationEnabled()) {
    return;
  }

  const dryRun = isResolutionDocumentMigrationDryRun();
  const pendingResolutions = await listLegacyResolutionRows(strapi);

  strapi.log.info(
    `[resolution-document-migration] ${pendingResolutions.length} legacy resolution(s) pending${dryRun ? ' (dry-run)' : ''}`
  );

  if (pendingResolutions.length === 0) {
    return;
  }

  let migrated = 0;
  let failed = 0;

  for (const resolution of pendingResolutions) {
    if (dryRun) {
      strapi.log.info(
        `[resolution-document-migration] dry-run id=${resolution.id} link=${resolution.link}`
      );
      continue;
    }

    try {
      const uploadedFile = await migrateResolutionDocument(strapi, resolution);
      migrated += 1;
      strapi.log.info(
        `[resolution-document-migration] migrated resolution ${resolution.id} -> file ${uploadedFile.id}`
      );
    } catch (error) {
      failed += 1;
      strapi.log.error(
        `[resolution-document-migration] failed resolution ${resolution.id}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  strapi.log.info(
    `[resolution-document-migration] completed migrated=${migrated} failed=${failed}`
  );
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

type TipoContenido = 'artículo' | 'resolución' | 'edicto' | 'evento de agenda';

interface EmailTemplateVars {
  managerName: string;
  tipo: string;
  titulo: string;
  contentUrl: string;
  unsubscribeUrl: string;
  primaryColor: string;
  accentColor: string;
  mutedFg: string;
  borderColor: string;
}

function toHex(value?: string, fallback = '#004884'): string {
  if (!value) return fallback;
  return value.startsWith('#') ? value : `#${value}`;
}

function buildEmailHtml({
  managerName,
  tipo,
  titulo,
  contentUrl,
  unsubscribeUrl,
  primaryColor,
  accentColor,
  mutedFg,
  borderColor,
}: EmailTemplateVars): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Nuevo ${tipo}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
         style="background-color:#f4f6f8;padding:40px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
             style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background-color:${primaryColor};padding:36px 40px;text-align:center;border-radius:12px 12px 0 0;">
            <p style="margin:0 0 6px;color:rgba(255,255,255,0.65);font-size:11px;font-weight:700;
                      letter-spacing:2px;text-transform:uppercase;">Boletín Informativo</p>
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;line-height:1.2;text-transform:uppercase;">
              ${managerName || 'Gestión Catastral'}
            </h1>
          </td>
        </tr>

        <!-- Badge strip -->
        <tr>
          <td style="background-color:${accentColor};padding:14px 40px;border-left:1px solid ${borderColor};
                     border-right:1px solid ${borderColor};border-bottom:1px solid ${borderColor};">
            <span style="display:inline-block;background-color:${primaryColor};color:#ffffff;
                         font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;
                         padding:4px 16px;border-radius:100px;">
              Nuevo ${tipo}
            </span>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background-color:#ffffff;padding:40px;border-left:1px solid ${borderColor};
                     border-right:1px solid ${borderColor};">
            <p style="margin:0 0 10px;color:${mutedFg};font-size:14px;line-height:1.5;">
              Se ha publicado nuevo contenido en el portal:
            </p>
            <h2 style="margin:0 0 36px;color:#1b1c1c;font-size:20px;font-weight:700;line-height:1.35;">
              ${titulo}
            </h2>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr><td align="center">
                <a href="${contentUrl}"
                   style="display:inline-block;padding:14px 40px;background-color:${primaryColor};
                          color:#ffffff;text-decoration:none;border-radius:100px;font-size:14px;
                          font-weight:700;letter-spacing:0.3px;">
                  Ver ${tipo} &rarr;
                </a>
              </td></tr>
            </table>
            <div style="border-top:1px solid ${borderColor};margin-top:40px;"></div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color:${accentColor};padding:20px 40px;border:1px solid ${borderColor};
                     border-top:none;border-radius:0 0 12px 12px;">
            <p style="margin:0;font-size:12px;color:${mutedFg};line-height:1.7;">
              Recibiste este correo porque estás suscrito al boletín de
              <strong>${managerName || 'este gestor catastral'}</strong>.<br>
              <a href="${unsubscribeUrl}" style="color:${primaryColor};text-decoration:underline;">
                Cancelar suscripción
              </a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

async function notifySubscribers(
  strapi: Core.Strapi,
  model: string,
  tipo: TipoContenido,
  entityId: number,
  titulo: string
) {
  try {
    const entity = await strapi.db.query(model).findOne({
      where: { id: entityId },
      populate: { manager: { populate: { theme_setting: true } } },
    });

    if (!entity?.manager?.id || !entity?.manager?.slug) {
      strapi.log.warn(`[notifySubscribers] Sin manager en ${tipo} id=${entityId}`);
      return;
    }

    const { id: managerId, slug: managerSlug, name: managerName, primary_color, theme_setting } = entity.manager;

    // Resolve theme colors — theme_setting takes priority, manager.primary_color as secondary fallback
    const primaryColor  = toHex(theme_setting?.primary   ?? primary_color, '#004884');
    const accentColor   = toHex(theme_setting?.accent,   '#E6EFFD');
    const mutedFg       = toHex(theme_setting?.mutedForeground, '#727781');
    const borderColor   = toHex(theme_setting?.border    ?? theme_setting?.accent, '#E6EFFD');

    const subscribers = await strapi.db
      .query('api::subscriber.subscriber')
      .findMany({ where: { manager: { id: managerId }, active: true } });

    if (!subscribers.length) return;

    const frontUrl    = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');
    const from        = process.env.SMTP_FROM || 'no-reply@catastrocota.gov.co';
    const transporter = createTransporter();

    const contentUrl = (() => {
      if (tipo === 'artículo' && entity.slug)        return `${frontUrl}/${managerSlug}/articulos/${entity.slug}`;
      if (tipo === 'resolución')                      return `${frontUrl}/${managerSlug}/resoluciones`;
      if (tipo === 'edicto')                          return `${frontUrl}/${managerSlug}/edictos`;
      if (tipo === 'evento de agenda' && entity.slug) return `${frontUrl}/${managerSlug}/agenda/${entity.slug}`;
      return `${frontUrl}/${managerSlug}`;
    })();

    // Send in parallel — one email per subscriber, never expose other addresses
    const results = await Promise.allSettled(
      subscribers
        .filter((s: { unsubscribe_token: string | null }) => s.unsubscribe_token)
        .map((subscriber: { email: string; unsubscribe_token: string }) => {
          const unsubscribeUrl = `${frontUrl}/${managerSlug}/unsubscribe?token=${subscriber.unsubscribe_token}`;
          return transporter.sendMail({
            from,
            to: subscriber.email,
            subject: `Nuevo ${tipo}: ${titulo}`,
            html: buildEmailHtml({ managerName, tipo, titulo, contentUrl, unsubscribeUrl, primaryColor, accentColor, mutedFg, borderColor }),
          });
        })
    );

    const sent   = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;
    strapi.log.info(`[notifySubscribers] ${sent} enviados, ${failed} fallidos — manager: "${managerSlug}" — ${tipo}: "${titulo}"`);
  } catch (err) {
    strapi.log.error('[notifySubscribers] Error enviando emails:', err);
  }
}

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    if (process.env.RUN_LEGACY_RESOLUTION_MIGRATION === 'true') {
      await migrateLegacyResolutionDocuments(strapi);
    } else {
      strapi.log.info(
        '[bootstrap] Skipping legacy resolution-document migration. Set RUN_LEGACY_RESOLUTION_MIGRATION=true to run it intentionally.'
      );
    }

    strapi.db.lifecycles.subscribe({
      models: ['api::article.article'],

      async afterCreate(event) {
        const { result } = event;
        if (result.publishedAt) {
          await notifySubscribers(strapi, 'api::article.article', 'artículo', result.id, result.title || 'Sin título');
        }
      },

      async afterUpdate(event) {
        const { result, params } = event;
        // Triggers only when publishedAt is explicitly set in this update (publish action)
        // and the result confirms it's now published
        const fuePublicado =
          result.publishedAt != null &&
          params?.data?.publishedAt != null &&
          params?.data?.publishedAt !== false;

        if (fuePublicado) {
          await notifySubscribers(strapi, 'api::article.article', 'artículo', result.id, result.title || 'Sin título');
        }
      },
    });

    strapi.db.lifecycles.subscribe({
      models: ['api::resolution.resolution'],

      async afterCreate(event) {
        const { result } = event;
        if (result.publishedAt) {
          await notifySubscribers(strapi, 'api::resolution.resolution', 'resolución', result.id, result.title || 'Sin título');
        }
      },

      async afterUpdate(event) {
        const { result, params } = event;
        const fuePublicado =
          result.publishedAt != null &&
          params?.data?.publishedAt != null &&
          params?.data?.publishedAt !== false;

        if (fuePublicado) {
          await notifySubscribers(strapi, 'api::resolution.resolution', 'resolución', result.id, result.title || 'Sin título');
        }
      },
    });

    strapi.db.lifecycles.subscribe({
      models: ['api::edicto.edicto'],

      async afterCreate(event) {
        const { result } = event;
        if (result.publishedAt) {
          await notifySubscribers(strapi, 'api::edicto.edicto', 'edicto', result.id, result.title || 'Sin título');
        }
      },

      async afterUpdate(event) {
        const { result, params } = event;
        const fuePublicado =
          result.publishedAt != null &&
          params?.data?.publishedAt != null &&
          params?.data?.publishedAt !== false;

        if (fuePublicado) {
          await notifySubscribers(strapi, 'api::edicto.edicto', 'edicto', result.id, result.title || 'Sin título');
        }
      },
    });

    strapi.db.lifecycles.subscribe({
      models: ['api::agenda-event.agenda-event'],

      async afterCreate(event) {
        const { result } = event;
        if (result.publishedAt) {
          await notifySubscribers(strapi, 'api::agenda-event.agenda-event', 'evento de agenda', result.id, result.title || 'Sin título');
        }
      },

      async afterUpdate(event) {
        const { result, params } = event;
        const fuePublicado =
          result.publishedAt != null &&
          params?.data?.publishedAt != null &&
          params?.data?.publishedAt !== false;

        if (fuePublicado) {
          await notifySubscribers(strapi, 'api::agenda-event.agenda-event', 'evento de agenda', result.id, result.title || 'Sin título');
        }
      },
    });
  },
};
