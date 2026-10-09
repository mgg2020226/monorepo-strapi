# Sites — monorepo multiempresa con Strapi y Next.js

Plataforma genérica para construir sitios de contenido con **Strapi 5**, **Next.js 16**, **React 19**, **Tailwind CSS 4**, **Turborepo** y **pnpm workspaces**. `EmpresaX` es la implementación frontend de ejemplo; Strapi administra el contenido de los sitios y marcas.

La arquitectura y las decisiones del proyecto están en [SITES_ARCHITECTURE.md](./SITES_ARCHITECTURE.md). Cada aplicación tiene una guía específica: [EmpresaX](./apps/empresaX/README.md) y [Strapi](./apps/strapi/README.md).

## Workspaces

| Ruta                     | Responsabilidad                                                                                 |
| ------------------------ | ----------------------------------------------------------------------------------------------- |
| `apps/empresaX`          | Frontend Next.js de ejemplo; rutas, resolución de dominio y renderizado de contenido de Strapi. |
| `apps/strapi`            | CMS Strapi 5, modelo de contenido, administración, API y PostgreSQL.                            |
| `apps/docs`              | Documentación Docusaurus.                                                                       |
| `packages/design-system` | Primitivas y componentes visuales compartidos.                                                  |
| `packages/sections`      | Secciones del page builder, utilidades Strapi y lógica reutilizable de formularios.             |
| `packages/shared-data`   | Tipos y constantes compartidos.                                                                 |
| `packages/strapi-types`  | Tipos TypeScript generados desde los esquemas de Strapi.                                        |
| `packages/logging`       | Logging estructurado y contexto de trazas.                                                      |

Los workspaces bajo `apps/*` y `packages/*` se descubren desde `pnpm-workspace.yaml`.

## Empezar en local

Requisitos: Node.js `^24`, pnpm y una base PostgreSQL accesible. Copia los ejemplos de entorno a `apps/strapi/.env` y `apps/empresaX/.env.local` y completa secretos, conexión y URL de Strapi antes de iniciar.

```bash
pnpm install
pnpm dev:strapi
pnpm dev:empresax # alias actual del workspace frontend
```

EmpresaX queda normalmente en `http://localhost:3000` y Strapi en `http://localhost:1337/admin`. Revisa [apps/strapi/.env.example](./apps/strapi/.env.example) y [apps/empresaX/.env.local.example](./apps/empresaX/.env.local.example). No guardes tokens reales en el repositorio.

Comandos adicionales desde la raíz:

```bash
pnpm dev             # todos los workspaces con tarea dev
pnpm dev:docs        # documentación
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm --filter @repo/strapi generate:types
```

## Cómo replicar EmpresaX para otras empresas

El modelo `Site` representa una empresa/marca, y las páginas, formularios, artículos, eventos y demás contenido se relacionan con ese sitio. Hay dos formas de operar:

1. **Otra empresa con la misma experiencia:** crear otro registro `Site`, asociarle su contenido y mapear su dominio a su `slug` en `SITE_DOMAIN`. Un despliegue de EmpresaX puede resolver varios dominios.
2. **Frontend o configuración independiente:** desplegar el mismo workspace EmpresaX con variables propias para la empresa. Si se necesitan diferencias de código mantenibles, crear otro workspace y reutilizar `@repo/design-system`, `@repo/sections` y `@repo/shared-data`; no copiar el monorepo como fork.

La primera opción comparte proceso y configuración del frontend. Hoy `APP_PUBLIC_URL` y los locales (`es`, `en`) son configuración global del despliegue, y la paleta guardada en `Site` aún no constituye un sistema completo de tema dinámico por empresa. Además, `CmsUserAccess.sites` documenta alcance, pero no impone aislamiento de los CRUD del panel. Si distintas empresas no deben acceder entre sí, hay que implementar autorización por sitio o separar instancias/credenciales antes de dar acceso editorial.

Consulta los pasos operativos y límites en [EmpresaX](./apps/empresaX/README.md) y [Strapi](./apps/strapi/README.md).

## Flujo de contenido

Strapi define el esquema y la zona dinámica de `Page.content`; EmpresaX consulta el contenido del `Site` resuelto y asocia cada UID de componente Strapi con un renderer React. Las secciones reutilizables están en `packages/sections`; el mapa del page builder y las rutas propias están en `apps/empresaX`. Para agregar un nuevo bloque hay que definirlo en Strapi, añadir el renderer y los tipos, y probar el ciclo completo en el panel.

`forms.dynamic-form` ya existe en el modelo de Strapi y está registrado en el renderer de EmpresaX. Su implementación reusable está en `packages/sections`; el adaptador de envío vive en el frontend y la validación/envío del lado servidor en Strapi.

## Documentación

- [Arquitectura y modelo de datos](./SITES_ARCHITECTURE.md)
- [Guía del frontend EmpresaX](./apps/empresaX/README.md)
- [Guía del CMS Strapi](./apps/strapi/README.md)
- [Aplicación de documentación](./apps/docs)
