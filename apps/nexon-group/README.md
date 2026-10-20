# Nexon Group — frontend Next.js

Aplicación Next.js del sitio Nexon Group. Resuelve el `Site` de Strapi mediante `SITE_DOMAIN` y renderiza sus páginas publicadas con los bloques `nexon.*`.

## Configuración local

1. Copia `.env.local.example` a `.env.local` y configura `STRAPI_URL`, las credenciales de lectura y el dominio local.
2. Ejecuta desde la raíz del monorepo: `pnpm --filter @repo/nexon-group dev`.
3. El slug configurado por defecto es `nexon-group`.

## Contenido Nexon

Los esquemas específicos viven en `apps/strapi/src/components/nexon/`. El contenido de texto de la página de inicio se carga con `pnpm --filter @repo/strapi seed:nexon-group` después de que Strapi registre los nuevos esquemas. Ese seed reemplaza las páginas y formularios ligados al sitio Nexon, no los registros de otros sitios; como no asigna multimedia, selecciona de nuevo las imágenes desde el editor después de ejecutarlo. El bloque de contacto se publica y el formulario queda inactivo: no se crea ninguna definición de formulario.

Los renderizadores Strapi están en `src/components/page-builder/nexon/`. La interfaz, las animaciones y el tema de Nexon viven en `@repo/design-system/nexon`. Las imágenes de clientes, servicios, metodología, quiénes somos e historias se asignan desde el selector de la Biblioteca multimedia de Strapi en cada campo del componente. No se buscan por nombre de archivo; si un campo queda vacío, el componente usa su presentación sin imagen.

Después de agregar campos de tipo `media` a los esquemas, reinicia Strapi para que el editor cargue los selectores. Abre la página de inicio, expande cada componente y elige los recursos existentes desde la Biblioteca multimedia; luego guarda y publica la página.

Los componentes nuevos de Nexon deben agregarse al Dynamic Zone de `api::page.page` y a `PageContentComponents`. Para actualizar los tipos generados, reinicia Strapi o ejecuta `pnpm --filter @repo/strapi generate:types`.
