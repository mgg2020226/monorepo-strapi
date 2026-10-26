# CAE Group — frontend Next.js

Este workspace publica el sitio de CAE Group. Es un frontend Next.js separado, pero utiliza el CMS común de apps/strapi. La aplicación resuelve su Site mediante el hostname y no debe caer en el slug de otra marca si el dominio no está configurado.

## Estructura

| Ruta | Propósito |
| --- | --- |
| src/app | Rutas localizadas, páginas y handlers HTTP del frontend. |
| src/components | Layouts, navegación y componentes de página. |
| src/components/page-builder | Renderers de contenido que llega desde Strapi. |
| src/lib | Site resolver, cliente Strapi, metadata, navegación y proxies. |
| src/hooks | Hooks de interfaz y consulta de contenido. |
| locales y public | Traducciones y recursos estáticos. |
| src/components/brand | Componentes visuales propios de CAE. |
| src/styles/cae.css | Estilos propios de la marca CAE. |
| packages/sections | Secciones y utilidades comunes a varios sitios. |

Los componentes de contenido específicos incluyen cae.homepage y cae.service-detail; sus esquemas viven en apps/strapi y sus renderers viven en esta app. El design system conserva solo los elementos genéricos compartidos.

## Variables de entorno

pnpm install crea .env.local desde .env.local.example si no existe. Configura:

- STRAPI_URL: origen del CMS común, habitualmente http://localhost:1337.
- STRAPI_REST_READONLY_API_KEY: token de lectura de Strapi; no lo expongas en el navegador.
- APP_PUBLIC_URL: origen canónico del frontend.
- SITE_DOMAIN: JSON de hostname a Site.slug. Usa el slug exacto asignado a CAE en Strapi.
- STRAPI_REVALIDATE_SECRET: debe coincidir con el secreto del CMS para revalidar contenido.
- STRAPI_PREVIEW_SECRET: opcional, para preview.

No añadas secretos reales al repositorio. Revisa la plantilla para variables opcionales de Basic Auth, reCAPTCHA, imgproxy y depuración.

## Ejecutar

Inicia el CMS compartido:

    pnpm dev:strapi

Inicia CAE desde otra terminal:

    pnpm dev:cae

Abre http://localhost:3000. El registro Site de CAE, sus páginas publicadas y sus relaciones deben existir en el CMS.

Comandos útiles:

    pnpm build:cae
    pnpm typecheck:cae
    pnpm test:cae

## Límites

SITE_DOMAIN solo selecciona un Site existente; no crea contenido ni configura DNS. La API token permite los endpoints otorgados en Strapi y no sustituye autorización por empresa en el panel editorial. Para el modelo compartido y la operación del CMS, consulta [README de Strapi](../strapi/README.md) y el [README raíz](../../README.md).
