# Bancaliv — Next.js y Strapi

Este workspace es el frontend Next.js de Bancaliv. Conserva el page builder compartido del monorepo, resuelve el sitio por hostname y solo consulta páginas relacionadas con el `Site` cuyo slug sea `bancaliv`. Los componentes visuales propios están en `packages/design-system/src/bancaliv`.

## Desarrollo

Desde la raíz:

```bash
pnpm dev:bancaliv
pnpm build:bancaliv
pnpm typecheck:bancaliv
```

Configura `apps/bancaliv/.env.local` a partir de `.env.local.example`. Usa `SITE_DOMAIN={"localhost":"bancaliv","127.0.0.1":"bancaliv","::1":"bancaliv"}` y el `STRAPI_URL` y token de lectura ya usados por el monorepo. En despliegue, asigna el dominio público al slug `bancaliv`.

## Contenido en Strapi

El modelo `Site` mantiene logo, favicon, paleta, idiomas, navegación, footer, contacto y las relaciones a páginas, formularios y contenido legal. Las páginas utilizan el content type `Page` con locales, SEO, draft/publish y `site`.

Para conservar las secciones particulares de la referencia, `Page.content` admite `bancaliv.section`. Cada bloque guarda el tipo de sección, textos, acciones, tarjetas y relaciones directas a medios de la biblioteca de Strapi. Las imágenes se eligen desde el selector de medios; URLs absolutas (incluido S3) se renderizan tal como llegan.

El registro `Site` y las páginas Bancaliv deben existir en Strapi y estar relacionadas por `site`. Tras el cambio de schema, reinicia Strapi para generar tipos. En el Content Manager crea o localiza el `Site` con slug `bancaliv`, configura idiomas, logo/favicon, paleta, navegación y footer, y crea las páginas localizadas relacionadas. En la página de inicio agrega bloques `Bancaliv section` en el orden deseado y publica cada localización. La sección de formulario solo debe usar definiciones activas con destinatario configurado.

Los endpoints `/api/*` están excluidos del proxy de idiomas para que formularios, preview, health y revalidación lleguen a sus route handlers.
