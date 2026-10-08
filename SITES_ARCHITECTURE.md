# Sites: arquitectura multiempresa con Strapi y Next.js

Implementación inicial basada en [strapi-next-monorepo-starter](https://github.com/notum-cz/strapi-next-monorepo-starter/tree/main).

## Estado de la implementación

- Strapi central en `apps/strapi`.
- Frontend inicial de Mapp en `apps/mapp`.
- Docusaurus conservado en `apps/docs`.
- `apps/mapp` fue renombrada a `apps/mapp`.
- Mapp es el único sitio migrado en esta etapa.
- El dominio resuelve el sitio mediante `SITE_DOMAIN_MAP`; cada host debe apuntar a un `Site.slug`.
- El preview usa `GET /api/preview` con `STRAPI_PREVIEW_SECRET`; activa `draftMode()` y evita indexación/caché compartida.
- No hay registro de usuarios públicos.
- Los formularios son stateless en el frontend; Strapi valida cada envío, lo registra en `Subscriber` y notifica por correo a la empresa.
- `Navbar` y `Footer` se leen desde `Site.header` y `Site.footer`; `Redirect` se relaciona con `Site` y se filtra por el dominio resuelto.

## Modelo de contenido

### Collection types

| Tipo               | Propósito                         | Campos principales                                                                                                                                                             |
| ------------------ | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Site`             | Empresa o marca                   | `name`, `slug`, `status`, `logo`, `favicon`, `palette`, `locales`, `header`, `footer`, `socialLinks`, `searchEnabled`, `typesenseCollection`                                   |
| `Page`             | Página, landing o página especial | `title`, `slug`, `fullPath`, `site`, `pageType`, `content`, `parent`, `children`, `seo`, `showInNavigation`, `navigationLabel`, `navigationOrder`                              |
| `BlogPost`         | Artículo de blog                  | `title`, `slug`, `excerpt`, `content`, `coverImage`, `site`, `category`, `tags`, `authorName`, `publishedAt`, `readingTimeMinutes`, `contentStatus`, `seo`, `featured`         |
| `BlogCategory`     | Categoría y filtro administrable  | `name`, `slug`, `description`, `color`, `site`, `order`, `active`                                                                                                              |
| `CalendarEvent`    | Evento                            | `title`, `slug`, `description`, `site`, `startDate`, `startTime`, `endDate`, `endTime`, `location`, `registrationUrl`, `image`, `contentStatus`, `seo`                         |
| `PortfolioProject` | Proyecto o caso de éxito          | `title`, `slug`, `summary`, `content`, `coverImage`, `gallery`, `site`, `externalUrl`, `featured`, `order`, `seo`                                                              |
| `LegalPage`        | Política o página legal           | `title`, `slug`, `content`, `site`, `legalType`, `version`, `effectiveDate`, `seo`, `contentStatus`                                                                            |
| `FormDefinition`   | Definición de formulario          | `name`, `slug`, `site`, `title`, `description`, `fields`, `submitLabel`, `successMessage`, `errorMessage`, `recipientEmail`, `active`, `honeypotEnabled`, `rateLimitPerMinute` |
| `Subscriber`       | Registro de envíos               | `site`, `formSlug`, `name`, `email`, `message`, `submissionData`                                                                                                                 |
| `CmsUserAccess`    | Alcance administrativo            | `adminUserId`, `email`, `displayName`, `role`, `sites`, `permissions`, `active`, `notes`                                                                                       |

### Single type

`PlatformSettings` contiene solo configuración global: `defaultLocale`, `availableLocales`, `globalRobotsPolicy`, `securityContactEmail`, `maintenanceMode` y `maintenanceMessage`.

Las credenciales de AWS, SMTP y Typesense nunca se almacenan en Strapi.

### Componentes

Los componentes están bajo `apps/strapi/src/components` y contienen los campos necesarios para que el administrador pueda editar contenido sin conocer nombres técnicos.

- `site.palette`: colores, fuentes, radio y modo de contraste.
- `site.locale-config`: idioma habilitado e idioma principal.
- `site.header-config`: logo, búsqueda, selector de idioma, CTA y navegación.
- `site.footer-config`: descripción, columnas, enlaces legales y copyright.
- `site.navigation-item`: etiqueta, destino, target y orden.
- `site.social-link`: plataforma, etiqueta, URL, icono y orden.
- `seo.metadata`: título, descripción, keywords, imagen social, canonical y robots.
- `ui.link`: etiqueta, href, tipo, target, variante, tamaño e icono.
- `ui.style`: contenedor, fondo, alineación y espaciados responsive.
- `ui.motion`: preset, duración, delay, trigger y respeto por reduced motion.
- `form.field`: nombre, etiqueta, tipo, placeholder, ayuda, required, opciones y límites.
- `form.option`: label, value y orden.
- `blog.tag`: nombre, slug, color y estado.
- `admin.permission`: recurso, acciones y alcance.

Los formularios permiten entre 1 y 30 campos. El límite protege el endpoint y puede ajustarse posteriormente.

## Idiomas

Strapi utiliza `@strapi/plugin-i18n` con `es` y `en`. Español es el idioma por defecto. Las URLs españolas conservan las rutas actuales y el inglés usa el prefijo `/en` mediante `next-intl`.

Se localizan los campos editoriales, SEO, navegación, formularios, blog, eventos y contenido legal. No se localizan relaciones, permisos, fechas, horas, colores ni secretos.

## Dynamic Zone

El campo `content` de `Page` mantiene los componentes existentes del starter y añade:

- `sections.hero-standard`
- `sections.content-rich-text`
- `sections.feature-grid`
- `sections.gallery`
- `sections.video`
- `sections.cta`
- `forms.dynamic-form`

La composición, las rutas y la lógica específica de Mapp viven en `apps/mapp`. Los componentes visuales reutilizables viven en `packages/design-system`, y las secciones y utilidades del page builder en `packages/sections`. Las primitivas visuales se basan en shadcn/ui, CVA, Tailwind CSS y Radix.

Cada sección debe ser mobile-first, usar tokens de la paleta del sitio y respetar `prefers-reduced-motion`. El CMS guarda presets permitidos; no guarda CSS ni JavaScript arbitrario.

## Formularios

El endpoint `POST /api/forms/:siteSlug/:formSlug/submit`:

1. Busca el formulario por sitio y slug.
2. Valida campos required y límites.
3. Procesa honeypot.
4. Envía el mensaje mediante el servicio de email de Strapi.
5. No persiste el contenido enviado.

`FormSubmission` se excluye porque no hay requerimiento de bandeja de entrada, auditoría, reintentos ni CRM. Se puede añadir después si aparece uno de esos requisitos.

## AWS S3

Variables solicitadas:

```env
AWS_ACCESS_KEY_ID=
AWS_ACCESS_SECRET=
AWS_REGION=
AWS_BUCKET=
AWS_FORCE_PATH_STYLE=false
UPLOAD_SIZE_LIMIT_MB=25
```

Se utiliza `@strapi/provider-upload-aws-s3`. Si las credenciales no existen, el entorno local usa almacenamiento local con el límite definido por `UPLOAD_SIZE_LIMIT_MB`.

## SMTP

No existe un servicio hospedado que sea a la vez gratuito, ilimitado y completamente libre. Para desarrollo se recomienda [Mailpit](https://github.com/axllent/mailpit). Para producción autogestionada se recomienda [Postal](https://github.com/postalserver/postal), sabiendo que requiere VPS, dominio, DNS, SPF, DKIM y DMARC.

Variables:

```env
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=
```

## Typesense

Se utiliza el plugin comunitario `@juadariasmar/strapi-plugin-typesense` versión `1.0.0`, condicionado a la configuración de estas variables:

```env
TYPESENSE_HOST=
TYPESENSE_PORT=8108
TYPESENSE_PROTOCOL=http
TYPESENSE_API_KEY=
```

Los índices iniciales son páginas y artículos. Los documentos incluyen sitio e idioma para que los filtros no mezclen empresas ni traducciones.

## Acceso administrativo

`CmsUserAccess` no crea un sistema de autenticación paralelo. `adminUserId` vincula cada registro con el usuario administrativo nativo de Strapi.

Los permisos usan los recursos:

```text
site, page, blog-post, blog-category, calendar-event,
portfolio-project, legal-page, form-definition, media
```

Y las acciones:

```text
read, create, update, delete, publish, unpublish
```

La relación `sites` documenta en qué empresas puede trabajar cada usuario, pero todavía no restringe por sí sola los CRUD de Strapi. Antes de activar varios equipos editoriales debe añadirse una policy/middleware de alcance por sitio; mientras tanto, el aislamiento administrativo no se considera garantizado.

## Seguridad

La implementación sigue la matriz de [OWASP Top 10:2025](https://top10.owasp.org/2025/en/): control de acceso, configuración segura, cadena de suministro, secretos, validación server-side, rate limiting, logs sin credenciales, manejo de errores y protección de subidas.

## Comandos

```bash
pnpm install
pnpm --filter @repo/strapi generate:types
pnpm dev:strapi
pnpm dev:mapp
pnpm typecheck
pnpm lint
```

Strapi usa PostgreSQL directamente. Debe existir una instancia accesible antes de ejecutar `pnpm dev:strapi`; la conexión se configura con `DATABASE_URL` o con `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD` y las variables opcionales de SSL. La configuración de Strapi no incluye Docker ni SQLite.

El archivo `.env.example` de Strapi y `.env.local.example` de Mapp contienen los valores necesarios para el primer entorno local.

## Pendientes explícitos

- Proveedor SMTP definitivo de producción.
- Traducción editorial final al inglés.
- Revisión de SEO/canonical, sitemap y breadcrumbs en ambos locales.
- Policy/middleware de alcance por `CmsUserAccess` para los CRUD administrativos.
- Valores de marca definitivos de cada sitio.
- Migración de los otros sitios.
- Retención futura de envíos si se requiere `FormSubmission`.
