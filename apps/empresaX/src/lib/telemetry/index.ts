import { sentryProvider } from "./providers/sentry"
import type { TelemetryProvider, TelemetryRuntime } from "./types"

export type { TelemetryProvider, TelemetryRuntime } from "./types"

/**
 * Initializes Sentry when configured. Called from the Next.js instrumentation hook.
 *
 * Kept free of the pino logger import: `register()` also runs in the edge
 * runtime, where pino is not available. Providers log their own status.
 */
export async function initializeTelemetry(
  runtime: TelemetryRuntime
): Promise<void> {
  const providers: TelemetryProvider[] = [sentryProvider()].filter(
    (provider): provider is TelemetryProvider => provider !== null
  )

  // Telemetry is best-effort: a misconfigured provider must not break
  // instrumentation, so isolate each provider and continue past failures.
  // `console` (not the pino logger) because register() also runs on the edge
  // runtime, where pino is unavailable.
  const results = await Promise.allSettled(
    providers.map((provider) => provider.initialize(runtime))
  )

  for (const [index, result] of results.entries()) {
    if (result.status !== "rejected") continue

    const provider = providers[index]
    if (!provider) continue

    console.error(
      `Telemetry provider "${provider.name}" failed to initialize`,
      result.reason
    )
  }
}
