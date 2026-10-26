import { createLogging } from "@repo/logging"

const serviceName = "strapi"
const environment = process.env.APP_ENV ?? process.env.NODE_ENV ?? "local"

const logging = createLogging({
  serviceName,
  environment,
  logLevel: process.env.LOG_LEVEL,
  pretty: process.env.NODE_ENV === "development",
})

/**
 * Main Strapi app logger for custom server code. Prefer this over
 * console.* when adding new code so logs are structured.
 */
export const logger = logging.logger

/**
 * Logs an error with stack, name, and message fields.
 */
export const logError = logging.logError
