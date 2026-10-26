# Sites — monorepo de contenido con Strapi y Next.js

Este repositorio reúne dos backends Strapi, varios frontends Next.js y paquetes compartidos. Los frontends de Bancaliv, CAE, EmpresaX y Nexon Group consumen el CMS común. MappDiffusion tiene un frontend y un backend propios.

## Mapa del repositorio

### Aplicaciones

| Ruta | Propósito | URL local habitual |
| --- | --- | --- |
| apps/strapi | CMS común: contenido multiempresa, panel editorial y API para los frontends Bancaliv, CAE, EmpresaX y Nexon Group. | http://localhost:1337/admin |
| apps/bancaliv | Frontend del sitio Bancaliv, conectado al CMS común. | http://localhost:3000 |
| apps/cae | Frontend CAE Group, conectado al CMS común. | http://localhost:3000 |
| apps/empresax | Frontend de referencia y base para sitios que comparten experiencia y page builder. | http://localhost:3000 |
| apps/nexon-group | Frontend del sitio Nexon Group, conectado al CMS común. | http://localhost:3000 |
| apps/strapi-mappdiffusion | CMS independiente de MappDiffusion, con su propio modelo, API y base de datos. | http://localhost:1339/admin |
| apps/mappdifussion | Frontend Next.js de MappDiffusion; consulta su API y Meilisearch. | http://localhost:3000 |

Los frontends Next.js usan el puerto 3000 por defecto. Para evitar conflictos, normalmente se ejecuta un frontend a la vez junto con su backend.

### Paquetes compartidos

| Ruta | Propósito |
| --- | --- |
| packages/design-system | Componentes UI compartidos, estilos y elementos específicos de cada marca. |
| packages/sections | Secciones reutilizables del page builder y utilidades de presentación. |
| packages/shared-data | Tipos, constantes y datos comunes. |
| packages/strapi-types | Tipos TypeScript generados a partir de los esquemas de apps/strapi. |
| packages/logging | Logging Pino usado por el backend Strapi común. |
| packages/typescript-config | Configuraciones TypeScript compartidas. |

pnpm-workspace.yaml incluye automáticamente todos los directorios de apps y packages.

### Cómo se conectan

En los cuatro sitios compartidos, el navegador solicita páginas a Next.js; el frontend resuelve el hostname al slug de `Site`, consulta el Strapi común y renderiza los componentes de `Page.content`. Strapi persiste el contenido en PostgreSQL. Next.js y Strapi son procesos independientes y se arrancan en terminales distintas.

MappDiffusion sigue otro flujo: su frontend consulta `apps/strapi-mappdiffusion` y Meilisearch. No comparte el modelo ni la base de datos del CMS común. El nombre de carpeta `mappdifussion` y el filtro `my-v0-project` corresponden al nombre actual del workspace; consérvalos al ejecutar comandos.

Los paquetes bajo `packages/` evitan duplicar código entre los frontends compatibles. `design-system` reúne componentes visuales y variantes de marca; `sections` aporta bloques del page builder; `shared-data` comparte datos y tipos; `strapi-types` contiene tipos generados para el CMS común. `logging` se usa en el backend Strapi común y `typescript-config` centraliza opciones de TypeScript.

## Requisitos e instalación

Se requiere Node.js 24 y pnpm 11.8. Para ejecutar cualquiera de los backends Strapi también se necesita PostgreSQL accesible.

Desde la raíz del repositorio:

    pnpm install

La instalación ejecuta setup:apps. Ese script crea archivos locales a partir de plantillas .example cuando todavía no existen; no sobrescribe archivos locales ya creados. Revisa y completa las variables antes de arrancar cada aplicación.

Para desarrollo local, crea o selecciona una base PostgreSQL para el backend que vayas a ejecutar. Completa sus secretos y conexión en `.env`; completa además el archivo de entorno del frontend elegido. Ejecutar un frontend no inicia automáticamente su CMS.

## Ejecutar aplicaciones

### Sitios Bancaliv, CAE, EmpresaX o Nexon Group

Primero configura apps/strapi/.env y el .env.local de la app elegida. En una terminal inicia el backend:

    pnpm dev:strapi

En otra, inicia solo uno de los frontends:

    pnpm dev:empresax
    pnpm dev:bancaliv
    pnpm dev:cae
    pnpm dev:nexon-group

Elige el comando correspondiente; no es necesario ejecutar los cuatro. Strapi estará en el puerto 1337 y el frontend en el 3000.

Abre `http://localhost:1337/admin` para configurar el CMS y `http://localhost:3000` para ver el frontend. El `Site` del sitio debe existir, estar publicado y tener el slug incluido en `SITE_DOMAIN`; el token de lectura debe tener permiso para consultar el contenido y los medios necesarios. Si otro proceso ya ocupa el puerto 3000, detén ese proceso o configura un puerto alternativo para Next.js.

### MappDiffusion

Configura apps/strapi-mappdiffusion/.env y apps/mappdifussion/.env. Inicia el backend:

    pnpm --filter strapi-mappdiffusion dev

En otra terminal inicia el frontend:

    pnpm --filter my-v0-project dev

Strapi-MappDiffusion escucha por defecto en el puerto 1339. Next.js usa el 3000. Configura NEXT_PUBLIC_STRAPI_URL para que apunte al backend que quieres usar; la plantilla del frontend trae un valor local distinto al puerto predeterminado del backend MappDiffusion.

El `.env.example` del frontend apunta al CMS común en el puerto 1337. Para probar MappDiffusion con su backend dedicado, cambia `NEXT_PUBLIC_STRAPI_URL` a `http://localhost:1339` en `apps/mappdifussion/.env`. Las variables `NEXT_PUBLIC_*` se exponen al navegador: la clave de Meilisearch debe ser de búsqueda restringida.

### Compilar, probar y revisar tipos

    pnpm build
    pnpm typecheck
    pnpm test

Para ejecutar una tarea sobre una app concreta, usa sus comandos específicos descritos en el README de esa app. MappDiffusion tiene Biome para revisión y formato:

    pnpm --filter my-v0-project check
    pnpm --filter my-v0-project format

`pnpm dev` intenta ejecutar las tareas de desarrollo de todos los workspaces y puede producir conflictos entre los frontends que comparten el puerto 3000. Para el trabajo habitual, inicia el backend correspondiente y un solo frontend con los comandos de arriba.

## Variables de entorno y secretos

Cada aplicación tiene su propia plantilla. No hay un único archivo de entorno para todo el monorepo:

- Strapi común: apps/strapi/.env.example se copia a apps/strapi/.env.
- Frontends Bancaliv, CAE, EmpresaX y Nexon Group: cada .env.local.example se copia a .env.local dentro de esa app.
- Backend MappDiffusion: apps/strapi-mappdiffusion/.env.example se copia a .env.
- Frontend MappDiffusion: apps/mappdifussion/.env.example se copia a .env.

No subas archivos .env ni tokens reales al repositorio. Las variables que empiezan por NEXT_PUBLIC_ se incorporan al JavaScript del navegador y deben contener únicamente datos públicos. En particular, NEXT_PUBLIC_MEILI_SEARCH_KEY debe ser una clave de búsqueda limitada; nunca uses allí la clave maestra de Meilisearch.

Para el CMS común, STRAPI_REVALIDATE_SECRET debe coincidir entre Strapi y el frontend. SITE_DOMAIN asigna cada hostname al slug real de Site en Strapi. Las variables opcionales de preview, Basic Auth, reCAPTCHA, imgproxy, SMTP, S3 y Typesense solo se configuran cuando se usa esa función.

## Flujo de contenido

En el CMS común, Site representa una empresa o marca; páginas y otros registros se relacionan con ese sitio. La zona Page.content contiene componentes Strapi y cada frontend registra sus renderizadores React. Las secciones genéricas viven en packages/sections; las variantes visuales de marca están en packages/design-system.

Para añadir campos o componentes al CMS común, cambia el esquema en apps/strapi, regenera tipos y actualiza el renderer del frontend correspondiente:

    pnpm generate:types
    pnpm sync-types

La importación de seed de Strapi reemplaza registros del entorno destino. Respalda los datos antes de usar:

    pnpm seed:check
    pnpm seed:export
    pnpm seed:import

## Guías por aplicación

- [Strapi común](apps/strapi/README.md)
- [Bancaliv](apps/bancaliv/README.md)
- [CAE](apps/cae/README.md)
- [EmpresaX](apps/empresax/README.md)
- [Nexon Group](apps/nexon-group/README.md)
- [Frontend MappDiffusion](apps/mappdifussion/README.md)
- [Backend Strapi MappDiffusion](apps/strapi-mappdiffusion/README.md)
