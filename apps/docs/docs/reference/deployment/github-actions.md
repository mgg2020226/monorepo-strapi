---
sidebar_position: 2
---

# GitHub Actions

GitHub Actions workflows live in `.github/workflows`. They verify pull requests, publish docs, and publish GitHub releases.

## Shared Setup Action

`.github/actions/setup-pnpm/action.yml` is a local composite action used by the workflows.

It performs three common setup steps:

1. Installs pnpm.
2. Configures Node from `.nvmrc` through `actions/setup-node`.
3. Runs `pnpm install --frozen-lockfile --prefer-offline` with pnpm cache enabled.

:::tip
Use the shared setup action when adding new workflows so pnpm, Node, and dependency caching stay consistent.
:::

## Workflows

| Workflow                    | File                            | Trigger                                      | Purpose                                                      |
| --------------------------- | ------------------------------- | -------------------------------------------- | ------------------------------------------------------------ |
| CI                          | `.github/workflows/ci.yml`      | Pull requests to `principal`                 | Lint, format-check, unit test, build Mapp, and build Strapi. |
| Deploy Docs to GitHub Pages | `.github/workflows/docs.yml`    | Push to `principal` touching docs, or manual | Build Docusaurus and deploy docs to GitHub Pages.            |
| Release                     | `.github/workflows/release.yml` | Push to `principal`                          | Run semantic-release and publish a GitHub release.           |

## CI

`.github/workflows/ci.yml` is the default pull request safety net.

It runs on pull requests targeting `principal` and performs:

```text
checkout
setup pnpm
copy example env files
pnpm lint
pnpm format:check
pnpm test:ci
pnpm build:mapp
pnpm build:strapi
```

The workflow sets `NPM_CONFIG_IGNORE_SCRIPTS=true` and `CI=true`. It also cancels older in-progress CI runs for the same pull request branch.

:::info Static UI export
The CI workflow contains a commented `pnpm build:mapp:static` step. Enable it only if the project intentionally deploys the UI with `NEXT_OUTPUT=export`.
:::

## Release

`.github/workflows/release.yml` runs on pushes to `principal`.

It checks out the full Git history, installs dependencies through the shared setup action, and runs:

```bash
pnpm exec semantic-release --extends @repo/semantic-release-config
```

:::info Release permissions
The workflow uses `GITHUB_TOKEN` and has write permissions for contents, issues, and pull requests so semantic-release can create GitHub releases and comment on related issues or PRs.
:::

## Docs Deployment

`.github/workflows/docs.yml` builds and publishes `apps/docs` to GitHub Pages.

It runs on:

- pushes to `principal` that change `apps/docs/**`
- changes to `.github/workflows/docs.yml`
- manual dispatch

The workflow configures GitHub Pages, builds Docusaurus with `DOCUSAURUS_URL` and `DOCUSAURUS_BASE_URL` from the Pages setup step, uploads the build artifact, then deploys it with `actions/deploy-pages`.

## Related Documentation

- [Testing](../testing/overview.md)
- [Git Hooks and Conventions](../workflow.md)
- [`@repo/semantic-release-config`](../packages/semantic-release-config.md)
