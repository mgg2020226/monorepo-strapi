---
sidebar_position: 1
---

# Installation

Use this page when you only need the shortest path to run `apps/empresaX` locally.

:::tip Full monorepo setup
For the full monorepo setup, start with [Getting Started > Installation](../getting-started/installation.md).
:::

## 1. Environment Variables

Copy the example file:

```bash
cp apps/empresaX/.env.local.example apps/empresaX/.env.local
```

Update values in `apps/empresaX/.env.local`. The UI needs Strapi connection values before content can render.

Start with:

```bash
STRAPI_URL=http://localhost:1337
STRAPI_REST_READONLY_API_KEY=
APP_PUBLIC_URL=http://localhost:3000
```

For token setup, env variables and their usage, see [Environment Variables](./environment-variables.md).

## 2. Run Locally

:::warning
Run EmpresaX development commands from the monorepo root. `pnpm dev:empresax` depends on workspace and Turbo context from the root project.
:::

```bash
nvm use
pnpm install
pnpm dev:empresax
```

`pnpm dev:empresax` starts the Next.js app only. EmpresaX runs on [http://localhost:3000](http://localhost:3000).

Use `pnpm dev` if you want to start the whole monorepo.
