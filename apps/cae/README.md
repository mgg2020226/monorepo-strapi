# CAE GROUP frontend

Next.js frontend for the CAE GROUP site record in the shared Strapi instance.
Copy `.env.local.example` to `.env.local` and set `SITE_DOMAIN` to the exact
`Site.slug` assigned to CAE in Strapi. The app deliberately has no EmpresaX
fallback, so it cannot accidentally query another site's content.

Page content is fetched by the host-resolved site slug, full path, and locale.
The `cae.homepage` and `cae.service-detail` dynamic-zone components are rendered
by CAE-specific components in `@repo/design-system/cae`. Their image fields
accept Strapi media objects with local upload paths or absolute storage URLs.
