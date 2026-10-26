# Bancaliv — frontend Next.js

Este workspace sirve el sitio Bancaliv y consume contenido del CMS común en apps/strapi. Resuelve el hostname de la petición, lo convierte al Site.slug configurado y consulta solamente contenido relacionado con ese sitio. Los componentes visuales de marca se comparten desde packages/design-system/src/bancaliv.

## Estructura

| Ruta | Propósito |
| ---                         | ---                                                                        |
| src/app                     | Rutas Next.js App Router, páginas, layouts, sitemap y endpoints.           |
| src/components              | Componentes del sitio y adaptadores del page builder.                      |
| src/components/page-builder | Traduce UID de componentes Strapi a renderizadores React.                  |
| src/lib                     | Resolución de sitio, API Strapi, metadata, proxies, imágenes y utilidades. |
| src/hooks                   | Hooks de interfaz y datos. |
| locales                     | Mensajes de traducción. |
| public y src/styles         | Recursos y estilos del frontend. |
| packages/design-system/src/bancaliv | Presentación y secciones visuales propias de Bancaliv.              |
| packages/sections           | Componentes y utilidades compartidos con otros frontends.                   |

## Variables de entorno

pnpm install crea .env.local desde .env.local.example si no existe. Configura:

- STRAPI_URL: origen del CMS común, normalmente http://localhost:1337.
- STRAPI_REST_READONLY_API_KEY: token de lectura limitado a los endpoints que usa el frontend. Permanece del lado servidor.
- APP_PUBLIC_URL: URL canónica del frontend, normalmente http://localhost:3000.
- SITE_DOMAIN: objeto JSON que relaciona cada hostname con el slug Site real. Para desarrollo, asigna localhost, 127.0.0.1 y ::1 al slug bancaliv.
- STRAPI_REVALIDATE_SECRET: secreto compartido con apps/strapi para autenticar revalidaciones.
- STRAPI_PREVIEW_SECRET: opcional, solo para habilitar el flujo de preview.
- NEXT_OUTPUT, Basic Auth, reCAPTCHA, imgproxy y variables de depuración son opcionales y solo se configuran si se usa esa función.

No pongas tokens en variables NEXT_PUBLIC_* ni en Git. La plantilla incluye más opciones y explica su uso.

## Ejecutar

Desde la raíz, arranca primero el CMS en una terminal:

    pnpm dev:strapi

Luego inicia Bancaliv en otra:

    pnpm dev:bancaliv

Abre http://localhost:3000. Asegúrate de que existe en Strapi un registro Site con slug bancaliv y que la API token puede leer sus páginas y medios.

Comandos útiles:

    pnpm build:bancaliv
    pnpm typecheck:bancaliv
    pnpm test:bancaliv

## Contenido

Site conserva marca, paleta, idiomas, navegación, footer y relaciones. El tipo Page incluye contenido dinámico; cada bloque Bancaliv se guarda como componente de Strapi y se dibuja con su renderer en el frontend. El bloque bancaliv.section conserva el orden y contenido definido por editores.

Para agregar o cambiar un bloque, actualiza el esquema en apps/strapi, genera los tipos y registra el renderer correspondiente. Consulta la [guía del CMS](../strapi/README.md), la [guía de EmpresaX](../empresax/README.md) y el [README raíz](../../README.md).
