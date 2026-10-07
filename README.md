# Sites — Plataforma multiempresa con Strapi y Next.js

Enterprise-ready monorepo starter for building content-driven websites with **Strapi v5**, **Next.js 16**, **React 19**, **TailwindCSS v4**, **shadcn/ui**, **Turborepo**, and **pnpm workspaces**.

La primera aplicación es Mapp. La arquitectura completa y el modelo de campos están documentados en [SITES_ARCHITECTURE.md](./SITES_ARCHITECTURE.md).

## Getting Started

Start locally with a short setup flow: clone the repository, install dependencies, and run the UI and Strapi apps from the monorepo root.

```bash
git clone https://github.com/mgg2020226/monorepo-strapi
cd monorepo-strapi

pnpm install
pnpm dev:strapi
pnpm dev:mapp
```

Strapi requiere una instancia PostgreSQL disponible. Configura `apps/strapi/.env` con `DATABASE_URL` o con las variables `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USERNAME` y `DATABASE_PASSWORD`.

For the full setup flow, see the [Quick Start guide](https://strapinextjs.docs.notum.tech/docs/getting-started/quick-start).

## Documentation

Visit the [full documentation](https://strapinextjs.docs.notum.tech) for architecture, setup, and workflow guides.
