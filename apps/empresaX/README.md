# EmpresaX — frontend de referencia

EmpresaX es el frontend Next.js de referencia para los sitios que comparten el modelo y el page builder del monorepo. Resuelve el hostname, selecciona el Site correspondiente en Strapi y renderiza sus páginas publicadas. El CMS define el contenido; el frontend asocia los UID de componentes a renderizadores React.

Para crear otro sitio con la misma experiencia, normalmente se añade un registro Site y su dominio en SITE_DOMAIN. Solo crea otro workspace cuando necesites código o despliegue independiente.

## Estructura

| Ruta | Responsabilidad |
| --- | --- |
| src/app/[locale] | Rutas localizadas para páginas, blog, eventos, portfolio y contenido legal. |
| src/app/api | Envío de formularios, preview, revalidación y otros endpoints del frontend. |
| src/lib/site.ts y site-server.ts | Normalización del hostname y resolución a Site.slug. |
| src/lib/strapi-api | Cliente, autenticación y consultas al CMS. |
| src/lib/metadata | Metadata SEO generada desde el contenido de Strapi. |
| src/components/page-builder | Registro UID de Strapi a componente React. |
| src/components | Layout, navegación, footer y adaptadores del sitio. |
| packages/sections | Bloques y utilidades compartidos. |
| packages/design-system | Primitivas UI y estilos comunes. |

El renderer debe existir para cada tipo de bloque que aparezca en Page.content. Los componentes reutilizables viven en packages; el frontend conserva adaptadores que dependen de sus rutas, formularios y APIs.

## Variables de entorno

pnpm install crea .env.local desde .env.local.example si no existe. Configura:

- APP_PUBLIC_URL: URL canónica de este despliegue, por ejemplo http://localhost:3000.
- STRAPI_URL: URL del CMS común, normalmente http://localhost:1337.
- STRAPI_REST_READONLY_API_KEY: token de solo lectura con acceso a los endpoints del sitio.
- SITE_DOMAIN: JSON que relaciona hostname con Site.slug. Ejemplo local:

      {"localhost":"empresax","127.0.0.1":"empresax","::1":"empresax"}

- STRAPI_REVALIDATE_SECRET: debe coincidir con el secreto configurado en Strapi.
- STRAPI_PREVIEW_SECRET: opcional, para el endpoint de preview.
- STRAPI_REST_CUSTOM_API_KEY: opcional, solo si una operación requiere permisos personalizados.
- NEXT_OUTPUT: opcional; define el modo Next indicado en la plantilla.
- BASIC_AUTH_*, RECAPTCHA_*, IMGPROXY_URL y variables DEBUG_*: opcionales según el despliegue.

Las variables de servidor y los tokens no deben llevar el prefijo NEXT_PUBLIC_. Ese prefijo publica el valor en el bundle del navegador. Cada despliegue tiene un APP_PUBLIC_URL canónico. Los slugs del mapa deben coincidir con registros Site existentes.

## Ejecutar

Instala dependencias desde la raíz y configura apps/strapi/.env y apps/empresax/.env.local. En una terminal inicia Strapi y en otra EmpresaX:

    pnpm dev:strapi
    pnpm dev:empresax

Abre http://localhost:3000. La variable SITE_DOMAIN debe apuntar al sitio que quieras probar.

Comandos:

    pnpm build:empresax
    pnpm typecheck:empresax
    pnpm test:empresax

## Replicar para otra marca

1. Crea en Strapi un Site con slug único y añade sus páginas y registros relacionados.
2. Añade hostnames al SITE_DOMAIN del despliegue y mapea cada uno al slug correcto.
3. Configura DNS y el proxy para dirigir los dominios al frontend.
4. Verifica locales, metadata, sitemap, medios, formularios y revalidación antes de publicar.

SITE_DOMAIN no configura DNS. El filtro por Site en las consultas no restringe por sí solo los permisos del Content Manager ni los API tokens. Antes de dar acceso editorial a organizaciones diferentes, define permisos adecuados o separa CMS, base de datos y credenciales.

## Cambiar el page builder

1. Define el componente en apps/strapi y añádelo a Page.content.
2. Genera y sincroniza los tipos:

       pnpm generate:types
       pnpm sync-types

3. Implementa el bloque reusable en packages/sections o packages/design-system cuando corresponda.
4. Registra el UID en src/components/page-builder.
5. Revisa preview, publicación, locale y relaciones; después ejecuta typecheck y las pruebas pertinentes.

Consulta la [guía de Strapi](../strapi/README.md) y el [README raíz](../../README.md).
