# Nexon Group — frontend Next.js

Este workspace sirve el sitio Nexon Group con Next.js y consume la instancia compartida de Strapi en apps/strapi. El middleware resuelve el hostname mediante SITE_DOMAIN y las consultas filtran el contenido por el Site.slug asociado.

## Estructura

| Ruta | Propósito |
| --- | --- |
| src/app/[locale] | Rutas localizadas del sitio, páginas, portfolio, contenido legal y metadata. |
| src/app/api | Revalidación, formularios, proxies y endpoints propios. |
| src/components/page-builder/nexon | Renderers de bloques específicos de Nexon. |
| src/components | Layouts, navegación, formularios e interfaz. |
| src/lib | Cliente Strapi, resolución del sitio, metadata, autenticación y proxies. |
| src/hooks, locales, public | Hooks, traducciones y recursos estáticos. |
| src/components/brand | Identidad visual, animaciones y componentes propios de Nexon. |
| src/styles/nexon.css | Estilos propios de la marca Nexon. |
| packages/sections | Secciones reutilizables entre frontends. |

Los esquemas específicos se definen en apps/strapi/src/components/nexon. Los componentes del CMS deben tener su renderer registrado en Nexon y los tipos deben regenerarse tras cambiar el esquema.

## Variables de entorno

pnpm install crea .env.local desde .env.local.example si no existe. Configura:

- STRAPI_URL: URL del CMS común, normalmente http://localhost:1337.
- STRAPI_REST_READONLY_API_KEY: token limitado de lectura, solo en el servidor.
- APP_PUBLIC_URL: URL canónica del frontend.
- SITE_DOMAIN: JSON que relaciona cada hostname con el Site.slug real de Nexon en Strapi.
- STRAPI_REVALIDATE_SECRET: secreto compartido con apps/strapi para la revalidación.
- STRAPI_PREVIEW_SECRET: opcional, si se habilita preview.
- NEXT_OUTPUT, Basic Auth, reCAPTCHA, imgproxy y variables de depuración son opcionales.

No expongas tokens en variables NEXT_PUBLIC_* ni los guardes en Git.

## Ejecutar

Inicia primero el CMS común y luego Nexon desde otra terminal:

    pnpm dev:strapi
    pnpm dev:nexon-group

Abre http://localhost:3000 y confirma que SITE_DOMAIN apunta al Site existente.

Comandos útiles:

    pnpm build:nexon-group
    pnpm typecheck:nexon-group
    pnpm test:nexon-group

El repositorio no ofrece actualmente un comando seed específico de Nexon. Crea o actualiza el Site y su contenido desde Strapi, o usa los comandos generales de seed solo si la exportación corresponde al entorno que quieres reemplazar.

Para generar tipos luego de cambiar esquemas:

    pnpm generate:types
    pnpm sync-types

Consulta [Strapi común](../strapi/README.md), [EmpresaX](../empresax/README.md) para el flujo multiempresa y el [README raíz](../../README.md).
