---
sidebar_position: 4
---

# `@repo/sections`

`@repo/sections` contains reusable React renderers for Strapi page-builder content. It is intentionally independent from `apps/mapp`: the Mapp app owns routing, data fetching, and the UID-to-component registry, while this package owns the visual section implementations and Strapi rendering utilities.

## Public API

Import sections from the package root:

```tsx
import { StrapiFaq, StrapiHero } from "@repo/sections"
```

The package also exports utilities such as `StrapiBasicImage`, `StrapiLink`, `StrapiCkEditorContent`, and `StrapiTipTapEditorContent`.

Keep the registry in `apps/mapp/src/components/page-builder/index.tsx`. A site-specific form or navigation component may remain in the app when it depends on Mapp authentication, API clients, or locale configuration.

## Adding a section

1. Add or update the Strapi component schema and generated types.
2. Implement the reusable renderer under `packages/sections/src/sections`.
3. Reuse primitives from `@repo/design-system`.
4. Export the component from `packages/sections/src/index.ts`.
5. Register the Strapi UID in the consuming app.

Run `pnpm --filter @repo/sections typecheck` and `pnpm --filter @repo/mapp typecheck` before review.
