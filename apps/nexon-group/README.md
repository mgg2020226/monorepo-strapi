# Nexon Group — frontend Next.js

Aplicación Next.js del sitio Nexon Group. Resuelve el `Site` de Strapi mediante `SITE_DOMAIN` y renderiza sus páginas publicadas con los bloques `nexon.*`.

## Configuración local

1. Copia `.env.local.example` a `.env.local` y configura `STRAPI_URL`, las credenciales de lectura y el dominio local.
2. Ejecuta desde la raíz del monorepo: `pnpm --filter @repo/nexon-group dev`.
3. El slug configurado por defecto es `nexon-group`.

## Contenido Nexon

Los esquemas específicos viven en `apps/strapi/src/components/nexon/`. El contenido de la página de inicio, sin multimedia, se carga con `pnpm --filter @repo/strapi seed:nexon-group` después de que Strapi registre los nuevos esquemas. Ese seed reemplaza las páginas y formularios ligados al sitio Nexon, no los registros de otros sitios. El bloque de contacto se publica y el formulario queda inactivo: no se crea ninguna definición de formulario.

Los renderizadores Strapi están en `src/components/page-builder/nexon/`. La interfaz, las animaciones y el tema de Nexon viven en `@repo/design-system/nexon`; los recursos visuales se sirven desde `public/nexon/` y no se cargan al CMS.

Los componentes nuevos de Nexon deben agregarse al Dynamic Zone de `api::page.page` y a `PageContentComponents`. Para actualizar los tipos generados, reinicia Strapi o ejecuta `pnpm --filter @repo/strapi generate:types`.
