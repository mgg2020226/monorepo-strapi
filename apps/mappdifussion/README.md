# MappDiffusion — frontend Next.js

Este workspace es el sitio público de MappDiffusion. Usa rutas dinámicas por gestor municipal, obtiene contenido desde Strapi y consulta Meilisearch para las búsquedas. Su backend asociado es apps/strapi-mappdiffusion, independiente de apps/strapi.

## Estructura

| Ruta | Propósito |
| --- | --- |
| app/[manager] | Rutas públicas de cada gestor: inicio, artículos, agenda, trámites, resoluciones, edictos, contacto y páginas legales. |
| app/api | Endpoints del frontend, como contacto y suscripciones. |
| components | Componentes de página, contenido y UI. |
| lib | Cliente de Strapi, URLs de imágenes, Meilisearch y funciones compartidas. |
| services y hooks | Acceso y lógica reutilizable para las páginas. |
| public | Recursos estáticos y worker de PDF que se copia durante postinstall. |
| scripts | Verificación smoke de producción y herramientas de soporte. |

El segmento [manager] usa un slug de gestor, por ejemplo cota. El backend debe contener datos relacionados con ese gestor.

## Variables de entorno

pnpm install crea .env desde .env.example si no existe. Las variables de frontend definidas en la plantilla son:

- NEXT_PUBLIC_STRAPI_URL: URL de la API que leerá el navegador y Next.js. En desarrollo el código tiene un fallback a localhost:1339; el backend apps/strapi-mappdiffusion usa localhost:1339, así que define esta variable para apuntar a 1339 si ese es el CMS local que quieres utilizar.
- NEXT_PUBLIC_MEILI_HOST: dirección del servicio Meilisearch.
- NEXT_PUBLIC_MEILI_SEARCH_KEY: por el prefijo NEXT_PUBLIC_, esta clave se expone al navegador. Usa exclusivamente una clave de búsqueda restringida; nunca la clave maestra.

No pongas secretos privados en variables NEXT_PUBLIC_ ni en el repositorio. La plantilla tiene valores de desarrollo; confirma la URL y la política de la clave antes de publicar.

## Ejecutar

Desde la raíz del monorepo, instala dependencias y arranca primero el backend:

    pnpm install
    pnpm --filter strapi-mappdiffusion dev

En otra terminal, configura NEXT_PUBLIC_STRAPI_URL y ejecuta el frontend:

    pnpm --filter my-v0-project dev

El backend escucha por defecto en el puerto 1339; Next.js usa 3000. Revisa el panel en http://localhost:1339/admin y el frontend en http://localhost:3000.

Comandos disponibles:

    pnpm --filter my-v0-project build
    pnpm --filter my-v0-project typecheck
    pnpm --filter my-v0-project check
    pnpm --filter my-v0-project format
    pnpm --filter my-v0-project smoke:prod

smoke:prod consulta el sitio y API configurados para una verificación de lectura. Revisa APP_URL, STRAPI_URL y MANAGER_SLUG antes de ejecutarlo para que apunte al entorno y gestor correctos.

## Relación con el backend

Este frontend no usa el modelo Site del CMS común. Su contenido y rutas dependen de los tipos de contenido de Strapi MappDiffusion. Para configurar el CMS, migraciones y advertencias de base de datos consulta el [README del backend](../strapi-mappdiffusion/README.md).
