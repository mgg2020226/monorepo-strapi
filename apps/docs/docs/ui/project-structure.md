---
sidebar_position: 2
---

# Project Structure

The UI app follows the Next.js App Router layout. Page-specific code should stay close to the route that owns it; reusable UI and page-builder renderers live in workspace packages.

Base path: `apps/empresaX/src`

| Path                      | Purpose                                                                                                                                                        |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app`                     | App Router. Page-specific components belong under `app/<route>/_components`, not in shared folders.                                                            |
| `components/elementary`   | EmpresaX-specific primitives and adapters, such as `ErrorBoundary`, `LocaleSwitcher`, and media components.                                                    |
| `components/page-builder` | EmpresaX composition: registry, navigation/footer, and business-specific forms. Shared sections live in [`@repo/sections`](../reference/packages/sections.md). |
| `components/providers`    | Global context providers, such as `ClientProviders`, `TrackingScripts`.                                                                                        |
| `packages/design-system`  | Shared UI primitives, forms, typography, editor renderers, and reusable UI hooks.                                                                              |
| `packages/sections`       | Shared Strapi page-builder sections and CMS rendering utilities.                                                                                               |
| `hooks`                   | EmpresaX-only hooks that depend on auth or EmpresaX API clients.                                                                                               |
| `lib`                     | Shared helpers such as auth, env vars, i18n, dates, navigation, reCAPTCHA, styles, etc.                                                                        |
| `lib/logging`             | Server-side structured logging wrapper around `@repo/logging`. See [Logging](#logging).                                                                        |
| `lib/metadata`            | Strapi SEO to Next.js `Metadata` helpers.                                                                                                                      |
| `lib/proxies`             | Next.js request proxy functions, such as `basicAuth`, `dynamicRewrite`. See [Proxies](./next-proxies.md).                                                      |
| `lib/strapi-api`          | Strapi clients, typed fetch helpers, and app-level content fetches in `content/server.ts`. See [Strapi API Client](./strapi-api-client.md).                    |
| `lib/telemetry`           | Pluggable telemetry provider registry (Azure Monitor, Sentry). See [Logging](#logging).                                                                        |
| `styles`                  | Global styles.                                                                                                                                                 |
| `types`                   | Type definitions.                                                                                                                                              |
| `../locales`              | next-intl message catalogs.                                                                                                                                    |

## Strapi API

Shared Strapi client code lives in `lib/strapi-api`. The base clients are kept in `base.ts`, `public.ts`, and `private.ts`; request authorization helpers live in `request-auth.ts`.

App-level fetch functions should be grouped in `lib/strapi-api/content/server.ts` or `lib/strapi-api/content/client.ts` depending on where they run. This keeps route components focused on rendering and gives repeated Strapi queries one stable place to evolve.

## Logging

Server-side code logs through `lib/logging.ts`, a thin wrapper around the shared
[`@repo/logging`](../reference/packages/logging.md) package. Import `logger`,
`logError`, and `withSpan` from it instead of using `console.*`:

```ts
import { logger, logError } from "@/lib/logging"

logger.info("Preview enabled", { slug, locale })
```

Logs are structured, secret-redacting, and trace-correlated. Where they are
shipped (Azure Monitor, Sentry) is decided by the pluggable provider registry in
`lib/telemetry`, initialized from `src/instrumentation.ts`.

Use the logger in server code (including the `proxy.ts` middleware — Node
runtime in Next.js 16+) and in dual server/client modules such as the Strapi API
client. In the browser pino degrades to a `console` shim with no backend export,
so keep plain `console.*` in purely client-side or hot paths (component dev
warnings, small client helpers). See [Observability](../reference/integrations/logging.md)
for the full setup.

## shadcn/ui

The UI app ships with [shadcn/ui](https://ui.shadcn.com/) components. These files are generated and updated by the shadcn CLI, so keep their names and folder structure intact.

Add new components with:

```bash
pnpm dlx shadcn@latest add accordion
```

Config lives in `apps/empresaX/components.json`. Theme tokens live in `apps/empresaX/src/styles/globals.css` and `@repo/design-system/theme.css`.

For shared tokens and global styling rules, see [Tokens And Global Styles](/docs/design-system/tokens-and-global-styles). For reusable component variants and states, see [CMS And Components](/docs/design-system/cms-and-components).

Use `cn()` from `@repo/design-system/utils` when merging Tailwind classes:

```tsx
import { cn } from "@repo/design-system/utils"

return <div className={cn("flex items-center", className)} />
```
