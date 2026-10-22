import { factories } from '@strapi/strapi';
import type { Core } from '@strapi/strapi';
import nodemailer from 'nodemailer';

type ContactPayload = {
  full_name: string;
  email: string;
  phone?: string;
  cadastral_code?: string;
  message: string;
  manager?: string;
};

type ManagerRecord = {
  id: number;
  name?: string;
  slug?: string;
};

type ContactPageSmtpSettings = {
  smtp_email?: string | null;
  smtp_password?: string | null;
};

function getContactPayload(ctx: { request: { body?: { data?: unknown } } }) {
  const data = ctx.request.body?.data;
  return data && typeof data === 'object' ? (data as ContactPayload) : null;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function getManagerAndSmtpSettings(
  strapi: Core.Strapi,
  managerDocumentId: string,
) {
  const smtpHost = process.env.SMTP_HOST?.split('#', 1)[0].trim();

  const manager = (await strapi.db
    .query('api::manager.manager')
    .findOne({
      where: { documentId: managerDocumentId },
      select: ['id', 'name', 'slug'],
    })) as ManagerRecord | null;

  if (!manager) {
    throw new Error('No se encontró el gestor asociado a la solicitud.');
  }

  const settings = (await strapi.db
    .query('api::contact-page.contact-page')
    .findOne({
      where: { manager: manager.id },
      select: ['smtp_email', 'smtp_password'],
    })) as ContactPageSmtpSettings | null;

  if (!settings?.smtp_email || !settings.smtp_password) {
    throw new Error(
      'El correo de notificaciones no está configurado en la página de contacto.',
    );
  }

  if (!smtpHost) {
    throw new Error('El servidor SMTP no está configurado.');
  }

  return {
    manager,
    smtpEmail: settings.smtp_email,
    smtpPassword: settings.smtp_password,
    smtpHost,
  };
}

function createContactTransporter(
  smtpHost: string,
  smtpEmail: string,
  smtpPassword: string,
) {
  const port = Number(process.env.SMTP_PORT) || 587;

  return nodemailer.createTransport({
    host: smtpHost,
    port,
    secure: process.env.SMTP_SECURE === 'true' || port === 465,
    auth: {
      user: smtpEmail,
      pass: smtpPassword,
    },
  });
}

async function sendContactNotification(
  strapi: Core.Strapi,
  payload: ContactPayload,
) {
  if (!payload.manager) {
    throw new Error('La solicitud no tiene un gestor asociado.');
  }

  const { manager, smtpEmail, smtpPassword, smtpHost } = await getManagerAndSmtpSettings(
    strapi,
    payload.manager,
  );
  const transporter = createContactTransporter(smtpHost, smtpEmail, smtpPassword);
  const fullName = escapeHtml(payload.full_name);
  const email = escapeHtml(payload.email);
  const phone = escapeHtml(payload.phone || 'No informado');
  const cadastralCode = escapeHtml(payload.cadastral_code || 'No informado');
  const message = escapeHtml(payload.message).replace(/\n/g, '<br />');

  await transporter.sendMail({
    from: smtpEmail,
    to: smtpEmail,
    replyTo: payload.email,
    subject: `Nueva solicitud de información - ${payload.full_name}`,
    text: [
      `Nueva solicitud de información para ${manager.name || manager.slug || 'el gestor'}.`,
      '',
      `Nombre: ${payload.full_name}`,
      `Correo: ${payload.email}`,
      `Teléfono: ${payload.phone || 'No informado'}`,
      `Código catastral: ${payload.cadastral_code || 'No informado'}`,
      '',
      'Mensaje:',
      payload.message,
    ].join('\n'),
    html: `
      <h2>Nueva solicitud de información</h2>
      <p>Se recibió una solicitud para <strong>${escapeHtml(manager.name || manager.slug || 'el gestor')}</strong>.</p>
      <table cellpadding="6" cellspacing="0" border="0">
        <tr><td><strong>Nombre</strong></td><td>${fullName}</td></tr>
        <tr><td><strong>Correo</strong></td><td>${email}</td></tr>
        <tr><td><strong>Teléfono</strong></td><td>${phone}</td></tr>
        <tr><td><strong>Código catastral</strong></td><td>${cadastralCode}</td></tr>
      </table>
      <p><strong>Mensaje</strong></p>
      <p>${message}</p>
    `,
  });
}

export default factories.createCoreController('api::contact.contact', ({ strapi }) => ({
  async create(ctx) {
    const payload = getContactPayload(ctx);

    if (!payload?.manager) {
      return ctx.badRequest('La solicitud no tiene un gestor asociado.');
    }

    try {
      await getManagerAndSmtpSettings(strapi, payload.manager);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo configurar el envío de correo.';
      return ctx.badRequest(message);
    }

    const response = await super.create(ctx);

    try {
      await sendContactNotification(strapi, payload);
    } catch (error) {
      strapi.log.error(
        `[contact] No se pudo enviar la notificación: ${error instanceof Error ? error.message : String(error)}`,
      );
      return ctx.internalServerError(
        'La solicitud fue guardada, pero no se pudo enviar el correo al gestor.',
      );
    }

    return response;
  },
}));
