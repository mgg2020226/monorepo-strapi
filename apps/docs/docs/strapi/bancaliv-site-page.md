---
sidebar_position: 5
description: Instrucción para trasladar a Strapi la configuración de Bancaliv que hoy está definida en el código fuente.
---

# Cargar Bancaliv en Strapi

Esta guía define cómo crear en Strapi el registro del sitio **Bancaliv** y su página de inicio a partir del contenido que hoy está escrito directamente en el proyecto `BANCALIV`.

## Instrucción de trabajo

> Crear un registro `Site` para Bancaliv y un registro `Page` para su página de inicio en el Strapi de este monorepo. Usa como única fuente de contenido el código existente en `C:\Users\marim\OneDrive\Escritorio\BANCALIV`; no inventes textos, cifras, datos de contacto, enlaces, imágenes ni traducciones. Empieza por revisar `src/routes/index.tsx`, `src/routes/nosotros.tsx`, `src/lib/allies-data.tsx`, `src/styles.css` y los archivos usados desde `src/assets` y `public`. En Strapi usa los campos y componentes ya definidos en `apps/strapi/src/api/site/content-types/site/schema.json`, `apps/strapi/src/api/page/content-types/page/schema.json` y `apps/strapi/src/components`. Crea el `Site` primero y asígnalo a la página. La página debe ser la raíz (`slug: /`), tipo `home`, sin padre y en español. Sube a la biblioteca multimedia los archivos que vengan de `BANCALIV`; una ruta local del otro proyecto no sirve como URL ni como archivo multimedia en Strapi. Ordena `content` según el orden visual de la portada y publica ambos registros. No ejecutes una importación de seed ni sobrescribas contenido existente como parte de esta carga.

## Fuente de contenido

La ruta local indicada para el proyecto fuente es:

```text
C:\Users\marim\OneDrive\Escritorio\BANCALIV
```

Consulta estas fuentes antes de cargar:

| Contenido                                                                                           | Fuente principal                                                        |
| --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Portada, navegación, productos, beneficios, aliados, cifras, testimonios, preguntas, CTA y contacto | `src/routes/index.tsx`                                                  |
| Información de la empresa, misión, visión y patrimonio autónomo                                     | `src/routes/nosotros.tsx`                                               |
| Enlaces y nombres de aliados comerciales                                                            | `src/lib/allies-data.tsx`                                               |
| Colores y estilos globales                                                                          | `src/styles.css`                                                        |
| Logo de Bancaliv, fotos y logos de entidades/aliados                                                | Imports al comienzo de `src/routes/index.tsx`, archivos en `src/assets` |
| Favicon                                                                                             | `public/favicon.ico`                                                    |

La primera carga de esta guía crea solo el `Site` y la página raíz de inicio. El código también tiene rutas independientes como `/nosotros`, términos y privacidad; no las conviertas en páginas adicionales dentro de esta tarea.

## Registro `Site`

En Strapi, abre **Content Manager → Site → Create new entry**. Usa estos datos de Bancaliv:

| Campo           | Valor / fuente                                                                                                                |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `name`          | `Bancaliv`                                                                                                                    |
| `slug`          | `bancaliv`                                                                                                                    |
| `logo`          | Sube `src/assets/logo-bancaliv.svg`                                                                                           |
| `favicon`       | Sube `public/favicon.ico` si el campo acepta el formato; si no, conviértelo a un formato de imagen permitido antes de subirlo |
| `contactEmail`  | `contacto@bancaliv.com`                                                                                                       |
| `contactPhone`  | `+573158257423`                                                                                                               |
| `address`       | `Cra 60 # 75 - 102, Barranquilla, Colombia`                                                                                   |
| `searchEnabled` | `false`                                                                                                                       |
| `socialLinks`   | Instagram: `https://www.instagram.com/bancaliv.oficial/`                                                                      |

### Configuración del sitio

- **Locales**: agrega `es` como habilitado y predeterminado. El contenido fuente de esta migración está en español. Solo agrega `en` cuando exista una traducción aprobada.
- **Palette**: usa los valores del bloque `:root` de `BANCALIV/src/styles.css`: `primary: oklch(0.55 0.22 350)`, `secondary: oklch(0.97 0.01 320)`, `accent: oklch(0.96 0.03 350)`, `background: oklch(1 0 0)`, `foreground: oklch(0.18 0.02 270)`, `muted: oklch(0.97 0.005 280)` y `border: oklch(0.92 0.01 280)`. El rosa equivalente se usa explícitamente como `#E5007D` en `src/routes/index.tsx`. Usa `radius: md` y `contrastMode: light` según el tema claro de la portada.
- **Default SEO**: en el componente `seo.metadata`, usa `metaTitle: Bancaliv — Bienestar financiero para tus colaboradores` y `metaDescription: Créditos por libranza, avances de nómina y soluciones financieras digitales para empresas y empleados.` según `head()` en `src/routes/index.tsx`. Completa cada locale solo con contenido disponible.
- **Header**: usa logo `default`, selector de idioma visible y búsqueda desactivada. Carga la navegación de la tabla siguiente y configura la CTA principal **Solicitar crédito** con el enlace de WhatsApp definido como `WA_LINK` en `src/routes/index.tsx` (`target: _blank`, tipo externo). El esquema solo incluye una CTA: no agregues un campo para `Soy cliente`.
- **Footer**: copia la descripción, enlaces, columnas, enlaces legales y copyright desde `Footer()` en `src/routes/index.tsx`. Activa `showSocialLinks`.

Navegación fuente del encabezado:

| Orden | Etiqueta  | Destino      |
| ----: | --------- | ------------ |
|     1 | Inicio    | `#inicio`    |
|     2 | Productos | `#productos` |
|     3 | Empresas  | `#empresas`  |
|     4 | Nosotros  | `/nosotros`  |
|     5 | Aliados   | `#aliados`   |
|     6 | Preguntas | `#preguntas` |

La URL `https://app.bancaliv.com/` aparece en el código como **Soy cliente**. El esquema actual de `Site.header` solo permite una CTA; conserva este dato en la fuente de referencia y no lo fuerces en un campo que no corresponda.

## Registro `Page` de inicio

Después de publicar el sitio, abre **Content Manager → Page → Create new entry** y crea la versión en español:

| Campo              | Valor                                                                                         |
| ------------------ | --------------------------------------------------------------------------------------------- |
| `title`            | `Inicio`                                                                                      |
| `breadcrumbTitle`  | `Inicio`                                                                                      |
| `slug`             | `/`                                                                                           |
| `fullPath`         | No lo escribas manualmente; usa la acción **Update hierarchy** si Strapi lo muestra pendiente |
| `pageType`         | `home`                                                                                        |
| `site`             | El registro `Bancaliv` creado arriba                                                          |
| `parent`           | Sin padre                                                                                     |
| `showInNavigation` | `false`                                                                                       |
| `content`          | Agrega las secciones de la portada en el orden descrito abajo                                 |
| `seo`              | Usa el título y la descripción fuente de `head()` en `src/routes/index.tsx`                   |

El slug `/` está reservado para la página raíz. No crees un segundo home para Bancaliv si ya existe una página raíz en ese locale; inspecciona y actualiza el registro existente, preservando su contenido ajeno a esta carga.

### Orden y equivalencia de secciones

El `Page.content` es una zona dinámica. Usa los componentes disponibles; no cambies los schemas ni sustituyas el texto fuente por contenido inventado.

| Orden | Sección en Bancaliv                      | Componente Strapi sugerido             | Datos a trasladar                                                                                                                                                                                                                                 |
| ----: | ---------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     1 | Hero                                     | `sections.hero-featured`               | Título “Impulsamos el bienestar financiero de tus colaboradores”, descripción, imagen `hero_background.png`, CTA de WhatsApp y tres ventajas: “100% Digital”, “Protegido”, “Hecho para ti”.                                                       |
|     2 | ¿Cómo funciona?                          | `sections.process-steps`               | Cuatro pasos “Solicita”, “Validamos”, “Aprobamos”, “Recibes”, sus descripciones e iconos `icon_solicita.png`, `icon_validamos.png`, `icon_aprobamos.png`, `icon_recibes.png`.                                                                     |
|     3 | Nuestros productos                       | `sections.product-grid`                | Los cuatro productos y sus descripciones exactas: Avance de Nómina, Avance de Prima, Crédito Libre Inversión y Libranza Sector Público.                                                                                                           |
|     4 | Beneficios para empresas y colaboradores | `sections.benefits-split`              | Dos paneles con sus títulos, descripciones, listas de beneficios e imágenes `empresa.png` y `colaboradores.png`.                                                                                                                                  |
|     5 | Protección / patrimonio autónomo         | `sections.security-block`              | Título, texto sobre el Patrimonio Autónomo administrado por Fiduciaria Bancolombia, imagen `fiduciaria.png` y puntos de Transparencia, Protección, Trazabilidad y Cumplimiento.                                                                   |
|     6 | Empresas que confían en nosotros         | `sections.logo-cloud`                  | Logos Leypal, Logifarma, Cehos, Fiduprevisora, Secretaría de Educación, Summind, Wow y CAE.                                                                                                                                                       |
|     7 | Nuestro impacto                          | `sections.statistics`                  | `+250` Empresas vinculadas; `+45.000` Colaboradores beneficiados; `+85.000` Créditos desembolsados; `+180.000M` Recursos colocados. Guarda cada valor como `number`, `prefix`, `suffix` y `description` según `Metrics()`; no cambies las cifras. |
|     8 | Historias reales                         | `sections.testimonials`                | Las tres citas, nombres, roles y fotos `carlos.jpg`, `Laura.jpg`, `alberto.png`.                                                                                                                                                                  |
|     9 | Aliados comerciales                      | `sections.logo-cloud`                  | Título, descripción y seis aliados de `src/lib/allies-data.tsx`: Wow, MappTech, CAE, The Netwifi, Vittorino y Nexon Group. Conserva cada URL disponible.                                                                                          |
|    10 | Preguntas frecuentes                     | `sections.faq`                         | Las cinco preguntas y respuestas declaradas en `Faq()` de `src/routes/index.tsx`.                                                                                                                                                                 |
|    11 | CTA final                                | `sections.cta` o `sections.cta-banner` | Título, descripción y botones del bloque `FinalCta()`, ambos con la URL de WhatsApp según `WA_LINK`.                                                                                                                                              |

Si una sección no puede representarse exactamente con el componente existente, anota qué campo falta y deja esa parte sin inventar. No modifiques el modelo de contenido como parte de la carga de registros.

### Presentación visual por sección

Después de que Strapi cargue los schemas actualizados, configura el componente
`style` dentro de cada sección. No agregues clases Tailwind ni nombres de marca
al componente genérico:

| UID de sección            | Valores iniciales de `style`                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `sections.hero-featured`  | `layout: background-image`, `container: wide`, `paddingTop: xl`, `paddingBottom: xl`, `itemAppearance: card` |
| `sections.process-steps`  | `layout: row`, `container: wide`, `itemAppearance: decorated`                                                |
| `sections.product-grid`   | `container: wide`, `itemAppearance: card`                                                                    |
| `sections.benefits-split` | `container: wide`, `itemAppearance: card`                                                                    |
| `sections.security-block` | `background: primary`, `container: wide`, `itemAppearance: card`                                             |
| `sections.statistics`     | `layout: row`, `container: wide`, `itemAppearance: card`                                                     |
| `sections.logo-cloud`     | `container: wide`                                                                                            |
| `sections.cta`            | `background: primary`, `paddingTop: xl`, `paddingBottom: xl`                                                 |

Estos valores seleccionan presentaciones soportadas por `@repo/sections`. El
frontend convierte las opciones de `ui.style` en clases compartidas; los colores
de marca siguen viniendo de la paleta del Site.

## Medios y publicación

2. Para cada `BasicImage`, carga el medio y completa un `alt` descriptivo que corresponda al uso original.
3. Guarda y publica el `Site`.
4. Crea o actualiza la página raíz en locale `es`, asóciala al `Site` y publica la página.
5. Si `fullPath` no aparece como `/`, abre el single type **Hierarchy**, revisa el cambio pendiente y ejecuta **Update hierarchy**.
6. Verifica que la página publicada tenga `slug: /`, `fullPath: /`, `pageType: home` y el `Site` Bancaliv.

`seed:import` no forma parte de este procedimiento: reemplaza datos existentes de Strapi.
