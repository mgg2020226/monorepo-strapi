import { getEnvVar } from "@/lib/env-vars"

/** Use the built-in console for app-level diagnostics. */
export const logger = console

export function logError(
  error: unknown,
  message = "Unhandled error",
  context?: Record<string, unknown>
) {
  console.error(message, context, error)
}

/** Keep expected, non-blocking build errors quiet unless explicitly enabled. */
export const logNonBlockingError = (...args: unknown[]) => {
  if (getEnvVar("SHOW_NON_BLOCKING_ERRORS")) {
    console.error("Non-blocking error", ...args)
  }
}
