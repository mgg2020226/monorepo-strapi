/** The Next.js runtime a telemetry provider is being initialized in. */
export type TelemetryRuntime = "nodejs" | "edge"

/**
 * A telemetry target registered by `initializeTelemetry()` when configured.
 */
export type TelemetryProvider = {
  readonly name: string
  /**
   * Activates the backend. Called once per server runtime from the Next.js
   * `instrumentation.ts` `register()` hook. Providers that do not support a
   * given runtime should no-op for it.
   */
  readonly initialize: (runtime: TelemetryRuntime) => void | Promise<void>
}
