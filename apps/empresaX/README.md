# EmpresaX — frontend Next.js

EmpresaX es el nombre de ejemplo para el frontend Next.js del monorepo. Resuelve el sitio por el hostname de la petición, consulta contenido publicado en Strapi y renderiza páginas usando Next.js App Router. No es un constructor visual autónomo: el esquema de contenido y los bloques disponibles se definen en Strapi y deben tener un renderer compatible en el frontend.

## Estructura y responsabilidades

| Ruta | Responsabilidad |
| --- | --- |
| `src/app/[locale]` | Rutas localizadas para páginas, blog, eventos, portfolio y contenido legal. |
| `src/lib/site.ts`, `src/lib/site-server.ts` | Normalización del hostname y resolución hostname → `Site.slug`. |
| `src/lib/strapi-api` | Cliente y consultas a la API de Strapi. |
| `src/components/page-builder/index.tsx` | Registro UID de componente Strapi → renderer React (`PageContentComponents`). |
| `src/components/page-builder` | Layout de página, navegación, footer y adaptadores ligados al frontend. |
| `src/app/api` | Proxies, envío de formularios, revalidación y endpoints del frontend. |
| `packages/sections` | Secciones visuales y lógica compartida que no debe duplicarse por empresa. |
| `packages/design-system` | Componentes/primitivas de UI compartidos. |

La página dinámica llega desde Strapi y el page builder itera sus bloques por UID. Por ejemplo, `forms.dynamic-form` se registra en `PageContentComponents` y delega la interfaz común a `@repo/sections`; EmpresaX conserva el adaptador que conoce sus endpoints y configuración.

## Configuración local

Desde la raíz del monorepo:

```bash
pnpm install
pnpm dev:strapi
pnpm dev:empresax
```

El workspace se identifica como `@repo/empresax`; los comandos específicos son `pnpm dev:empresax`, `pnpm build:empresax`, `pnpm test:empresax` y `pnpm typecheck:empresax`.

Copia `apps/empresaX/.env.local.example` como `apps/empresaX/.env.local`. Configura como mínimo `APP_PUBLIC_URL`, `STRAPI_URL`, `SITE_DOMAIN_MAP`, `STRAPI_REST_READONLY_API_KEY` y los secretos requeridos para los flujos que vayas a probar. Configura la base de datos y secretos propios de Strapi en `apps/strapi/.env`; ver [guía de Strapi](../strapi/README.md).

```env
APP_PUBLIC_URL=http://localhost:3000
STRAPI_URL=http://127.0.0.1:1337
STRAPI_REST_READONLY_API_KEY=token-de-solo-lectura
SITE_DOMAIN_MAP={"localhost":"empresax","127.0.0.1":"empresax","::1":"empresax"}
```

Los valores del mapa deben corresponder a slugs existentes en `Site`. El slug no se cambia automáticamente al renombrar el workspace: actualiza el registro `Site` existente a `empresax` en Strapi o conserva su slug actual en `SITE_DOMAIN_MAP` hasta completar esa migración.

El token debe tener únicamente los permisos de lectura necesarios y permanecer del lado servidor: no usar prefijo `NEXT_PUBLIC_` ni publicarlo en el navegador o en Git. La guía de variables completa está en `.env.local.example`.

## Replicar para otras empresas

### Misma experiencia, otro dominio

1. Crear en Strapi un registro `Site` con `slug` único y completar marca, estado y contenido.
2. Relacionar las páginas y demás registros con ese `Site`.
3. Añadir el dominio en `SITE_DOMAIN_MAP`, apuntando al mismo slug, por ejemplo:

   ```env
   SITE_DOMAIN_MAP={"empresax.example.com":"empresax","empresa.example.com":"empresa-x"}
   ```

4. Configurar DNS/proxy para que ambos dominios lleguen al despliegue de EmpresaX. Validar URLs canónicas, sitemap, assets, idioma y caché antes de publicar.

`SITE_DOMAIN_MAP` selecciona el slug; por sí solo no configura DNS ni un dominio. Para otra empresa que requiera `APP_PUBLIC_URL` propio, usar un despliegue independiente del frontend y configurar sus variables de entorno. Un despliegue tiene un solo `APP_PUBLIC_URL` canónico.

### Experiencia distinta

Si otra empresa necesita una identidad o comportamiento realmente diferente, crear un workspace con nombre de paquete único y consumir los paquetes compartidos. Evitar duplicar `apps/empresaX` como una implementación divergente. Al añadir un workspace revisar `pnpm-workspace.yaml` (el patrón `apps/*` ya lo incluye), configuración de Turbo, variables, despliegue y pruebas.

## Límites actuales del multiempresa

- El mapeo de dominios y el filtrado de contenido por slug están implementados.
- `APP_PUBLIC_URL` y los idiomas soportados por Next (`es`, `en`) son globales al despliegue; `Site.locales` no crea rutas Next dinámicamente por marca.
- `Site.palette` existe en el CMS, pero el tema del frontend todavía no se deriva íntegramente de esa paleta.
- El filtro por `Site` en las consultas del frontend no sustituye autorización del panel. `CmsUserAccess.sites` aún no restringe por sí mismo las operaciones CRUD de Strapi.
- El tipo de datos generado (`@repo/strapi-types`) representa el esquema de la instancia Strapi del monorepo. Si se separan instancias con esquemas divergentes, hay que planear y generar tipos para cada contrato.

No conceder acceso a equipos de empresas diferentes en una instancia compartida hasta implementar y probar el alcance por sitio. Para aislamiento fuerte, usar instancias separadas de Strapi y bases de datos/credenciales separadas.

## Añadir una sección nueva

1. Crear/ajustar el componente en `apps/strapi/src/components` y añadir su UID a `Page.content` (Dynamic Zone).
2. Ejecutar `pnpm --filter @repo/strapi generate:types`.
3. Implementar la sección visual en `packages/sections` si es genérica; mantener en EmpresaX el renderer/adaptador si depende de sus APIs o rutas.
4. Registrar el UID y el renderer en `src/components/page-builder/index.tsx`.
5. Verificar el componente en Strapi, comprobar draft/publicado y locale, y ejecutar `pnpm --filter @repo/empresax typecheck` y pruebas pertinentes.

## Comandos

```bash
pnpm dev:empresax
pnpm --filter @repo/empresax typecheck
pnpm --filter @repo/empresax lint
pnpm --filter @repo/empresax test
pnpm --filter @repo/empresax build
```

Ver también el [README del monorepo](../../README.md) y la [arquitectura general](../../SITES_ARCHITECTURE.md).
