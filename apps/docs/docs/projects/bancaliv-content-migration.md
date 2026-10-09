---
title: Bancaliv content migration
---

# Bancaliv: migrate content from Strapi to EmpresaX

The source project is in `BANCALIV.zip`. Its landing page is built with TanStack Start, React, and Vite. The monorepo's supported CMS renderer is the Next.js app in `apps/empresaX`; the source project is the reference for copy, assets, interactions, and visual structure.

## Data flow

```text
Strapi Site + localized Page.content dynamic zone
                    ↓
EmpresaX resolves the Site from the request hostname
                    ↓
PageContentComponents maps each Strapi UID to @repo/sections
                    ↓
The ordered sections render on the page
```

Page content is rendered in the order of the `content` dynamic zone. Text, buttons, images, logos, and repeated items belong in Strapi. Layout and behavior belong in the React section in `packages/sections`.

## Homepage section map

Create a `Site` with slug `bancaliv`, status `active`, Spanish locale, brand palette, logo, header, footer, contact details, and social links. Create a `Page` related to that Site with page type `home` and the root slug `/`. Add these blocks in this order:

| Source section                     | Strapi block                 | Editable content                                                                        |
| ---------------------------------- | ---------------------------- | --------------------------------------------------------------------------------------- |
| Hero                               | `sections.hero-featured`     | Eyebrow, title, description, hero image, CTA links, three value propositions            |
| How it works                       | `sections.process-steps`     | Heading, intro, ordered steps, optional step icons                                      |
| Products                           | `sections.product-grid`      | Heading, intro, product names/descriptions/icons, optional CTA per product              |
| Business and collaborator benefits | `sections.benefits-split`    | Two panels, titles, descriptions, images, repeatable benefits                           |
| Security/trust                     | `sections.security-block`    | Eyebrow, title, description, supporting heading, optional image, trust points and icons |
| Partner strip                      | `sections.animated-logo-row` | Heading and partner logos with alternative text                                         |
| Impact metrics                     | `sections.statistics`        | Heading, intro, figures, number, prefix/suffix, and description                         |
| Testimonials                       | `sections.testimonials`      | Heading, intro, quote, name, role, and optional avatar for each testimonial             |
| Commercial allies                  | `sections.logo-cloud`        | Eyebrow, heading, intro, logos, optional safe links; choose strip or grid               |
| FAQ                                | `sections.faq`               | Heading, subtitle, repeatable question and answer fields                                |
| Final call to action               | `sections.cta`               | Heading, description and CTA links                                                      |

Existing blocks were reused where they fit. New blocks and repeatable row schemas were added only for the source sections that had no adequate field model or renderer.

## Media to upload

Upload the original assets from the ZIP through Strapi's Media Library and select them in the relevant component fields:

- hero image;
- four process icons;
- product icons/images;
- the two benefits images;
- security image, if retaining it;
- partner and commercial-alliance logos;
- testimonial avatars, if those are approved for publication;
- Site logo and favicon.

Set meaningful alternative text for informative images and logos. Decorative images may use an empty alternative text. Do not put binary files or private data into text fields.

## Pages beyond the homepage

- Create `/nosotros` as a `Page` for the Bancaliv Site; compose it from `sections.content-rich-text`, `sections.gallery`, or the sections that fit its real content.
- Transfer the three legal documents to `LegalPage` records (`terms`, `privacy`, and `other` for the personal-data treatment document). Preserve the source text, version, and effective date. Have Bancaliv's authorized reviewer approve the legal text before publishing it.
- Configure footer and navigation links from Site settings and link to the corresponding page slugs.

## Local preview

In `apps/empresaX/.env.local`, map the local frontend host to the Bancaliv Site slug:

```env
SITE_DOMAIN_MAP={"localhost":"bancaliv","127.0.0.1":"bancaliv","::1":"bancaliv"}
```

Keep existing Strapi URLs and server-side API tokens unchanged; never expose tokens in browser config or commit `.env.local`. `SITE_DOMAIN_MAP` chooses which Strapi Site the frontend requests. The Site must be active, and its Pages must be published to appear outside preview mode.

After Strapi reloads the schemas, use the admin Content Manager to create the Site and home Page, populate each block with approved Bancaliv content and uploaded media, save the page as a draft, and verify it in the frontend preview. No sample records or mock content are included. Publish only after reviewing text, media, links, responsive layouts, and legal/financial claims.

## Known rollout constraint

The frontend resolves the Site by hostname and the page renderer filters by the resolved Site slug. The separate `CmsUserAccess.sites` relation should not be treated as complete editorial isolation until its permissions are verified; do not grant a new editor restricted-to-Bancaliv access based on that relation alone.
