# MappDiffusion Strapi backend

Fresh Strapi 5.59.0 TypeScript scaffold created with PostgreSQL as its only database driver. Content types, components, APIs, plugin extensions, application lifecycles, migration utilities, and local upload files were ported from `MappDiffusion-back`.

## Database safety

The private `.env` is configured with the existing PostgreSQL connection and the development server uses port `1339` to avoid conflicting with the current backend. The new app has not been started against that database. Strapi can reconcile database schema at startup, so take a database backup and review the generated schema changes before connecting this app to the existing data.

The legacy resolution-document migration in `src/index.ts` is disabled by default. It only runs when `RUN_LEGACY_RESOLUTION_MIGRATION=true` is set intentionally.

## Install and run

From the monorepo root:

```powershell
pnpm install --filter strapi-mappdiffusion
pnpm --filter strapi-mappdiffusion dev
```

The monorepo enforces a 48-hour package release age. At the time of scaffolding, that policy blocked installing Strapi 5.59.0, so dependencies still need to be installed after the package versions meet the policy or after selecting a mature Strapi release.
