---
sidebar_position: 4
---

# Data Seeding

Para crear el sitio de Bancaliv y su página de inicio a partir del contenido del proyecto fuente, sigue la [guía de carga de Bancaliv](./bancaliv-site-page.md).

Data seeding lets developers share Strapi pages, site configuration, roles, and demo content.

The starter stores Strapi exports in the repository. Imports are manual and can be used to initialize or refresh a development database.

Use seed exports when a change needs content or configuration to travel with the code. Typical examples are new page-builder components, changed component schemas, updated demo pages, or baseline content required by the UI.

Seed imports overwrite existing Strapi data, so treat them as a project snapshot for development and test environments. For production, import intentionally and only when that is part of the deployment process.

## How It Works

Seed exports live in the Strapi app:

```text
apps/strapi/seed/exports/strapi-export-YYYY-MM-DD-HHmmss.tar.gz
```

The newest timestamped export is treated as the current seed. There is no separate promotion step.

Strapi starts without checking or importing seed data. To inspect whether baseline content exists, run `pnpm seed:check`; to import the latest export, run `pnpm seed:import` explicitly.

## Commands

All commands run from the **monorepo root** via Turbo.

Seed import and export scripts require `bash`. On Windows, use WSL, Git Bash, or another shell with Bash available.

```bash
pnpm seed:check   # Check whether Page and Site content exists
pnpm seed:import  # Import the latest timestamped seed export
pnpm seed:export  # Create a new timestamped seed export
```

`seed:export` keeps only the latest 5 exports.

## Local Development Workflow

For normal development, start Strapi with `pnpm dev:strapi`. When you need the shared content, run `pnpm seed:import` manually. Imports overwrite existing Strapi data, so export or otherwise preserve local work first.

## PR Workflow

When a PR creates or changes Strapi collections, components, single types, or content that other developers need locally:

1. Make the schema or content changes in Strapi.

2. Export the updated seed:

   ```bash
   pnpm seed:export
   ```

3. Commit the new `seed/exports/strapi-export-YYYY-MM-DD-HHmmss.tar.gz`.
4. Open the PR with the schema/type/content changes and the new seed export together.

Other developers can import the new export after pulling the branch by running from root:

```bash
pnpm seed:import
```

Importing a Strapi export **overwrites existing data**, so developers should export or otherwise preserve local work before importing over it.

## First Run Without Seed

If no seed export exists, create the baseline content manually in Strapi:

- Create a `Site` entry with its header and footer configuration
- Create one root page in `Page` collection with `slug` set to `/`; Strapi synchronizes its `fullPath` automatically on publish.

The UI supports `en` and `es` by default, so enable both locales in Strapi and create localized content for both.
