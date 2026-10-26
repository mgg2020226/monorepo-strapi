# Strapi MappDiffusion — backend independiente

Este es el CMS propio de MappDiffusion. Tiene sus propios esquemas, plugins, procesos de migración y base de datos. No comparte el modelo ni la base de apps/strapi; el frontend correspondiente es apps/mappdifussion.

## Estructura

| Ruta | Responsabilidad |
| --- | --- |
| config | Configuración de servidor, PostgreSQL, S3, Meilisearch y middlewares. |
| src/api | APIs de gestores, artículos, resoluciones, contacto y otros contenidos. |
| src/components | Componentes del modelo de contenido. |
| src/extensions y src/admin | Extensiones y personalización del panel. |
| src/index.ts | Hooks de arranque y tareas de migración heredadas. |
| scripts | Herramientas puntuales de auditoría, reparación y migración de datos. |
| public/uploads | Archivos cargados localmente; en producción se puede configurar S3. |

## Antes de conectarlo a una base existente

El primer arranque puede aplicar cambios al esquema de base de datos. Haz un respaldo y revisa la configuración antes de apuntar esta app a datos existentes. No la conectes a la base del CMS común por conveniencia: son proyectos independientes.

## Variables de entorno

Al ejecutar pnpm install en la raíz, setup:apps crea apps/strapi-mappdiffusion/.env desde .env.example si aún no existe.

Configura PostgreSQL con DATABASE_URL o los campos DATABASE_CLIENT, DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_USERNAME y DATABASE_PASSWORD. Genera valores secretos únicos para APP_KEYS, API_TOKEN_SALT, ADMIN_JWT_SECRET, JWT_SECRET, TRANSFER_TOKEN_SALT y ENCRYPTION_KEY.

Variables opcionales según las funciones usadas:

- PUBLIC_URL define la URL pública de Strapi; el puerto local predeterminado es 1339.
- MEILI_HOST y MEILI_MASTER_KEY conectan el plugin de búsqueda. La clave maestra es secreta y no debe exponerse al frontend.
- AWS_ACCESS_KEY_ID, AWS_ACCESS_SECRET, AWS_REGION y AWS_BUCKET habilitan el proveedor S3. AWS_ROOT_PATH, AWS_ACL y AWS_SIGNED_URL_EXPIRES ajustan su comportamiento.
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS y SMTP_FROM configuran el correo usado por la aplicación.
  El código lee SMTP_PASS; si un archivo .env local conserva el nombre SMTP_PASSWORD del CMS común, el transporte no recibirá esa contraseña.
- ALLOWED_ORIGINS limita los orígenes permitidos por el middleware.

Las herramientas de mantenimiento pueden aceptar variables adicionales, como MEDIA_AUDIT_BASE_URL, STRAPI_PUBLIC_URL, RESOLUTION_DATE_SOURCE_BASE_URL y DATABASE_NAME/DATABASE_USERNAME/DATABASE_PASSWORD. Revisa el script concreto antes de ejecutar una migración.

La plantilla incluye algunos valores de migración, pero no enumera todos los interruptores que consume src/index.ts. RUN_LEGACY_RESOLUTION_MIGRATION y MIGRATE_RESOLUTION_DOCUMENTS son operaciones distintas. Déjalas desactivadas salvo que hayas respaldado y quieras ejecutar expresamente la tarea correspondiente.

## Ejecutar

Desde la raíz:

    pnpm --filter strapi-mappdiffusion dev

El panel local se sirve en http://localhost:1339/admin. Comandos de producción:

    pnpm --filter strapi-mappdiffusion build
    pnpm --filter strapi-mappdiffusion start

Hay comandos para auditorías y migraciones dentro del package.json de esta app. Ejecuta uno solo después de leer su propósito, verificar las variables requeridas y respaldar la base. Evita lanzar migraciones heredadas durante un arranque normal.

Consulta también el [README del frontend MappDiffusion](../mappdifussion/README.md) y el [README raíz](../../README.md).
