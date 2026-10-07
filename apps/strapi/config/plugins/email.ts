import { logger } from "../../src/utils/logging"
import type { EnvGetter } from "../../types/internals"

export function emailConfig(env: EnvGetter) {
  const host = env("SMTP_HOST")
  const user = env("SMTP_USER")
  const pass = env("SMTP_PASSWORD")

  if (!host || !user || !pass) {
    logger.warn("SMTP is not configured. Form email delivery is disabled.")

    return { config: null }
  }

  const from = env("SMTP_FROM", user)
  logger.info("Using generic SMTP email provider.")

  return {
    config: {
      provider: "nodemailer",
      providerOptions: {
        host,
        port: Number(env("SMTP_PORT", "587")),
        secure: env("SMTP_SECURE", "false") === "true",
        auth: { user, pass },
      },
      settings: { defaultFrom: from, defaultReplyTo: from },
    },
  }
}
