# Strapi — CMS común del monorepo

Esta aplicación es el backend compartido de Bancaliv, CAE, EmpresaX y Nexon Group. Strapi define el esquema de contenido, administra editores desde el panel y expone la API que consultan los frontends. Usa PostgreSQL. En desarrollo, los archivos pueden guardarse localmente; S3 es opcional.

No es el backend de MappDiffusion. Ese proyecto tiene una instancia separada en apps/strapi-mappdiffusion.

## Estructura

| Ruta | Responsabilidad |
| --- | --- |
| config | Servidor, base de datos, plugins y middlewares de Strapi. |
| src/api | Endpoints, controladores, servicios y rutas propias. |
| src/components | Componentes y bloques del modelo; incluye variantes específicas de sitios. |
| src/documentMiddlewares | Reglas aplicadas al guardar o publicar documentos. |
| src/extensions | Extensiones del comportamiento de Strapi o plugins. |
| src/lifeCycles | Automatizaciones asociadas al ciclo de vida de usuarios y otros modelos. |
| src/admin | Personalización del panel, como CKEditor y configuración de marca. |
| scripts | Validación y exportación/importación de datos seed. |
| types/generated | Tipos generados desde los esquemas de Strapi. |

El tipo Site representa una marca o sitio. El contenido de páginas y formularios se relaciona con ese registro. Page.content es una Dynamic Zone: cada UID incluido en el esquema debe tener un renderer React en el frontend que lo use.

## Preparar variables

Desde la raíz, pnpm install crea apps/strapi/.env a partir de .env.example si aún no existe. También puedes copiarlo manualmente. Completa al menos:

- Secretos de Strapi: APP_KEYS, API_TOKEN_SALT, ADMIN_JWT_SECRET y JWT_SECRET. Usa valores aleatorios distintos en producción.
- PostgreSQL: DATABASE_URL o DATABASE_CLIENT, DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_USERNAME y DATABASE_PASSWORD.
- URL pública: APP_URL, especialmente en producción.

No dejes asignaciones vacías cuando esperas que se use un valor predeterminado: Strapi puede interpretar una cadena vacía como un valor explícito. La plantilla documenta los campos adicionales.

Variables opcionales:

- AWS_ACCESS_KEY_ID, AWS_ACCESS_SECRET, AWS_REGION y AWS_BUCKET activan almacenamiento S3 cuando se configura el proveedor.
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD y SMTP_FROM configuran el envío de correo.
- Typesense se activa cuando están definidos TYPESENSE_HOST y TYPESENSE_API_KEY.
- CLIENT_URL y STRAPI_REVALIDATE_SECRET conectan la revalidación de caché con el frontend. STRAPI_REVALIDATE_SECRET debe coincidir en ambos lados.
- ADMIN_PANEL_CONFIG_API_AUTH_TOKEN y APP_BRAND personalizan la configuración de la interfaz de administración.
- STRAPI_MCP_ENABLED, CRON_ENABLED y WEBHOOKS_POPULATE_RELATIONS controlan funciones opcionales del servidor.

No compartas secretos con el navegador ni los subas a Git.

## Ejecutar

Desde la raíz, inicia el servidor de desarrollo:

    pnpm dev:strapi

El panel queda en http://localhost:1337/admin. Para producción usa build y start:

    pnpm build:strapi
    pnpm start:strapi

Comandos específicos:

    pnpm --filter @repo/strapi typecheck
    pnpm test:strapi
    pnpm generate:types
    pnpm sync-types

Después de cambiar esquemas o componentes, genera los tipos y sincronízalos al paquete compartido antes de actualizar consumidores.

## Datos iniciales y operación

La aplicación no importa seeds al iniciar. Los comandos disponibles desde la raíz son:

    pnpm seed:check
    pnpm seed:export
    pnpm seed:import

seed:import reemplaza los registros incluidos en la exportación. Haz una copia de seguridad de la base destino antes de importarla.

El frontend filtra contenido por Site.slug, pero ese filtro no impone aislamiento a los usuarios del panel ni convierte un API token global en uno limitado por sitio. Revisa roles y permisos de Strapi antes de dar acceso editorial a organizaciones distintas. Para aislamiento fuerte, usa instancias, bases y credenciales separadas.

Consulta el [README del monorepo](../../README.md).
