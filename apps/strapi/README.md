# Strapi — CMS del monorepo

Strapi 5 es el CMS de la plataforma. Define el modelo de contenido, ofrece el panel editorial y sirve al frontend EmpresaX mediante su API. La persistencia es PostgreSQL; las imágenes usan almacenamiento local en desarrollo salvo que se configure un proveedor como S3 o Azure.

## Modelo de contenido

`Site` representa una empresa o marca. Páginas, formularios, blog, categorías, eventos, proyectos de portfolio, páginas legales, envíos y redirecciones se asocian a un sitio. En `apps/strapi/src/api` están los collection types; sus componentes están en `apps/strapi/src/components`.

`Page.content` es una Dynamic Zone. Al agregar un UID de componente al esquema de Strapi también hay que implementar o reutilizar su renderer en EmpresaX; ver [README de EmpresaX](../empresaX/README.md). El renderer de `forms.dynamic-form` ya está registrado en el frontend.

Los tipos de frontend se regeneran después de cambios al esquema:

```bash
pnpm --filter @repo/strapi generate:types
```

## Crear otra empresa/sitio en el panel

Para una nueva empresa con el esquema y la experiencia existentes:

1. En `Content Manager` → `Site`, crear el sitio y definir un `slug` único. Completar estado, paleta, idiomas, metadatos, cabecera, pie y datos de contacto.
2. Crear las páginas y registros relacionados seleccionando ese `Site`; no reutilizar registros que pertenezcan a otra empresa.
3. Para cada idioma habilitado, crear/revisar la localización de los contenidos traducibles. El frontend actualmente soporta globalmente `es` y `en`; la configuración `Site.locales` del CMS no activa idiomas adicionales en Next.js.
4. Añadir el dominio al `SITE_DOMAIN` del despliegue EmpresaX para que resuelva al slug creado. Ver [replicación multiempresa en EmpresaX](../empresaX/README.md#replicar-para-otras-empresas).
5. Revisar permisos de lectura API, publicación, medios y entrega de contenido antes de activar el sitio.

El `Site` no crea automáticamente páginas ni configura el dominio. Los slugs deben coincidir exactamente entre el registro CMS y `SITE_DOMAIN`.

## API y tokens

EmpresaX consume la API server-side. Crea en Strapi un API Token de solo lectura con acceso únicamente a los endpoints requeridos por las consultas del frontend. Coloca su valor en `STRAPI_REST_READONLY_API_KEY` dentro de `apps/empresaX/.env.local` (o en el gestor de secretos del despliegue). Configura `STRAPI_URL` con el origen de Strapi.

No guardar tokens en Git, no pasarlos a variables `NEXT_PUBLIC_*` y no exponerlos en componentes cliente. Los tokens de escritura deben estar separados y no son necesarios para renderizar las páginas públicas. Configura también `STRAPI_PREVIEW_SECRET` en ambos lados solo si vas a usar preview.

Una API token de solo lectura no es por sí misma un límite de tenant. El frontend filtra contenido por `Site.slug`, pero los permisos nativos del API token suelen ser globales por endpoint; no equivalen a aislamiento entre empresas.

## Panel editorial y aislamiento

`CmsUserAccess` guarda el usuario, los sitios asignados y permisos previstos. Actualmente la relación `sites` documenta el alcance, pero no impone por sí misma restricciones sobre los CRUD del Content Manager. Por ello, no se debe afirmar que los equipos de diferentes empresas están aislados en un Strapi compartido.

Antes de dar acceso a editores de varias empresas, implementar y probar una policy/middleware que limite lectura, creación, actualización, borrado y publicación por sitio, incluyendo relaciones, medios y endpoints personalizados. Si se necesita aislamiento inmediato o fuerte, desplegar instancias de Strapi y bases de datos separadas por empresa.

## Configurar y ejecutar

1. Copiar `apps/strapi/.env.example` a `apps/strapi/.env`.
2. Completar secretos de Strapi, PostgreSQL y URL pública. No dejar valores de ejemplo en producción.
3. Iniciar Strapi desde la raíz del monorepo:

   ```bash
   pnpm install
   pnpm dev:strapi
   ```

   Panel local: `http://localhost:1337/admin`.

Variables mínimas: `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `JWT_SECRET`, `DATABASE_CLIENT=postgres`, `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USERNAME` y `DATABASE_PASSWORD`. También puede usarse `DATABASE_URL`.

### Importante sobre seed y registros manuales

El comando de desarrollo del workspace ejecuta el seed runner. En el ejemplo, `AUTO_SEED_ENABLED=true` y `AUTO_SEED_MODE=empty`: se importa el seed cuando faltan contenidos iniciales (página/navbar/footer). Para una instalación ya inicializada, los registros se pueden crear desde el panel; evita `AUTO_SEED_MODE=force`, porque puede sobrescribir contenido al iniciar. En producción, revisa explícitamente las variables y usa `pnpm start` según el procedimiento de despliegue.

Los `.env` son locales y no deben añadirse al control de versiones. Las variables opcionales de email, almacenamiento, Typesense, observabilidad y revalidación están descritas en `.env.example`.

## Operación habitual

```bash
pnpm dev:strapi
pnpm --filter @repo/strapi typecheck
pnpm --filter @repo/strapi lint
pnpm --filter @repo/strapi test
pnpm --filter @repo/strapi generate:types
```

Para publicar contenido: crear/editar el registro, asociarlo al `Site`, verificar relaciones y traducciones, revisar la vista previa y publicar. Confirmar luego que EmpresaX resuelve el dominio al mismo slug y obtiene el contenido esperado.

## Pendientes de plataforma

- Autorización efectiva por sitio para los equipos editoriales; `CmsUserAccess` todavía no la aplica.
- Proveedor SMTP y almacenamiento definitivo para producción, más validación de credenciales y permisos.
- Alinear idiomas habilitados por sitio con routing/locales del frontend si cada marca debe tener configuraciones distintas.
- Validar tema dinámico basado en `Site.palette` en EmpresaX.
- Completar dominios, branding, contenido inicial y configuración de despliegue por empresa.

Consulta el [README raíz](../../README.md) y [SITES_ARCHITECTURE.md](../../SITES_ARCHITECTURE.md) para el panorama del monorepo y las decisiones del modelo.
