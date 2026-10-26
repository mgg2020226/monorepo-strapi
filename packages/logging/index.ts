import pino from "pino"

export type LogContext = Record<string, unknown>
export type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal"
export type PinoLogLevel = LogLevel | "silent"
export interface CreateLoggerOptions {
  readonly serviceName: string
  readonly environment: string
  readonly logLevel?: string
  readonly pretty?: boolean
}

export function createLogging({
  serviceName,
  environment,
  logLevel,
  pretty = false,
}: CreateLoggerOptions) {
  const pinoOptions: pino.LoggerOptions = {
    level: getLogLevel(logLevel),
    base: {
      service: serviceName,
      environment,
    },
    // Redaction runs before a log line is written. These paths cover common
    // top-level fields and nested objects so accidental secrets are replaced
    // before logs are emitted locally.
    redact: {
      paths: [
        "authorization",
        "cookie",
        "headers.authorization",
        "headers.cookie",
        "password",
        "secret",
        "token",
        "apiKey",
        "clientSecret",
        "*.authorization",
        "*.cookie",
        "*.password",
        "*.secret",
        "*.token",
        "*.apiKey",
        "*.clientSecret",
      ],
      censor: "[redacted]",
    },
    serializers: {
      err: pino.stdSerializers.err,
      error: pino.stdSerializers.err,
    },
  }

  if (pretty) {
    pinoOptions.transport = {
      target: "pino-pretty",
      options: {
        colorize: true,
        ignore: "pid,hostname",
        translateTime: "HH:MM:ss.l",
      },
    }
  }

  const pinoLogger = pino(pinoOptions)

  function log(level: LogLevel, message: string, context?: LogContext) {
    pinoLogger[level](
      {
        ...context,
      },
      message
    )
  }

  const logger = {
    trace: (message: string, context?: LogContext) =>
      log("trace", message, context),
    debug: (message: string, context?: LogContext) =>
      log("debug", message, context),
    info: (message: string, context?: LogContext) =>
      log("info", message, context),
    warn: (message: string, context?: LogContext) =>
      log("warn", message, context),
    error: (message: string, context?: LogContext) =>
      log("error", message, context),
    fatal: (message: string, context?: LogContext) =>
      log("fatal", message, context),
  }

  function logError(
    error: unknown,
    message = "Unhandled error",
    context?: LogContext
  ) {
    const normalizedError = normalizeError(error)

    pinoLogger.error(
      {
        ...context,
        err: normalizedError,
      },
      message
    )
  }

  return {
    logger,
    logError,
  }
}

function getLogLevel(level: string | undefined): PinoLogLevel {
  const allowedLevels = new Set([
    "trace",
    "debug",
    "info",
    "warn",
    "error",
    "fatal",
    "silent",
  ])

  return allowedLevels.has(level ?? "") ? (level as PinoLogLevel) : "info"
}

function normalizeError(error: unknown): Error {
  if (error instanceof Error) {
    return error
  }

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    const normalizedError = new Error(error.message)
    Object.defineProperty(normalizedError, "name", {
      value:
        "name" in error && typeof error.name === "string"
          ? error.name
          : "Error",
    })

    return normalizedError
  }

  return new Error(String(error))
}
