const APP_URL = (
  process.env.APP_URL || "https://difusion.mapptech.com.co"
).replace(/\/+$/, "");
const STRAPI_URL = (
  process.env.STRAPI_URL || "https://micatastro.mapptech.com.co"
).replace(/\/+$/, "");
const MANAGER_SLUG = process.env.MANAGER_SLUG || "cota";

const pageChecks = [
  { path: `/${MANAGER_SLUG}`, mustContain: ["Artículos", "¿Quiénes somos?"] },
  { path: `/${MANAGER_SLUG}/home-page` },
  { path: `/${MANAGER_SLUG}/agenda` },
  { path: `/${MANAGER_SLUG}/tramites` },
  { path: `/${MANAGER_SLUG}/productos` },
  { path: `/${MANAGER_SLUG}/edictos` },
  {
    path: `/${MANAGER_SLUG}/resoluciones`,
    mustContain: ["Resoluciones", "Ver PDF"],
  },
  { path: `/${MANAGER_SLUG}/quienes-somos`, mustContain: ["¿Quiénes somos?"] },
  { path: `/${MANAGER_SLUG}/articulos`, mustContain: ["Artículos"] },
  { path: `/${MANAGER_SLUG}/contact`, mustContain: ["Atención al ciudadano"] },
  { path: `/${MANAGER_SLUG}/condiciones-uso` },
  { path: `/${MANAGER_SLUG}/politicas-privacidad` },
];

const forbiddenMarkers = [
  "Navegación no configurada",
  "Página de inicio no configurada",
  "El pie de página no está disponible",
  "La página de ¿Quiénes Somos? no está disponible",
  "El contenido de las políticas de privacidad no está disponible",
  "El contenido de las condiciones de uso no está disponible",
  "Tipo de contenido requerido:",
  "http://localhost:1337",
  "http://localhost:7700",
  "209.145.59.20:1337",
];

function ensure(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function fetchText(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`);
  }
  const text = await response.text();
  return { response, text };
}

async function checkPages() {
  const failures = [];

  for (const check of pageChecks) {
    const url = `${APP_URL}${check.path}`;
    try {
      const { text } = await fetchText(url);

      for (const marker of check.mustContain || []) {
        ensure(text.includes(marker), `${url} is missing "${marker}"`);
      }

      for (const marker of forbiddenMarkers) {
        ensure(
          !text.includes(marker),
          `${url} contains forbidden marker "${marker}"`,
        );
      }
    } catch (error) {
      failures.push(error.message);
    }
  }

  return failures;
}

async function checkCms() {
  const failures = [];

  const managerUrl = `${STRAPI_URL}/api/managers?filters[slug][$eq]=${MANAGER_SLUG}`;
  const navUrl = `${STRAPI_URL}/api/navigation-layouts?filters[manager][slug][$eq]=${MANAGER_SLUG}&populate=*`;
  const homeUrl = `${STRAPI_URL}/api/home-pages?filters[manager][slug][$eq]=${MANAGER_SLUG}&populate=*`;
  const footerUrl = `${STRAPI_URL}/api/footer-layouts?filters[manager][slug][$eq]=${MANAGER_SLUG}&populate=*`;
  const resolutionsUrl = `${STRAPI_URL}/api/resolutions?filters[manager][slug][$eq]=${MANAGER_SLUG}&populate=document`;

  try {
    const manager = JSON.parse((await fetchText(managerUrl)).text);
    ensure(manager.data?.length > 0, "manager data is empty");
  } catch (error) {
    failures.push(error.message);
  }

  try {
    const nav = JSON.parse((await fetchText(navUrl)).text);
    ensure(nav.data?.length > 0, "navigation-layouts is empty");
    ensure(
      (nav.data?.[0]?.items?.length ?? 0) > 0,
      "navigation items are empty",
    );
  } catch (error) {
    failures.push(error.message);
  }

  try {
    const home = JSON.parse((await fetchText(homeUrl)).text);
    ensure(home.data?.length > 0, "home-pages is empty");
  } catch (error) {
    failures.push(error.message);
  }

  try {
    const footer = JSON.parse((await fetchText(footerUrl)).text);
    ensure(footer.data?.length > 0, "footer-layouts is empty");
  } catch (error) {
    failures.push(error.message);
  }

  let documentPath = null;
  try {
    const resolutions = JSON.parse((await fetchText(resolutionsUrl)).text);
    ensure(resolutions.data?.length > 0, "resolutions is empty");
    documentPath = resolutions.data?.[0]?.document?.url || null;
  } catch (error) {
    failures.push(error.message);
  }

  return { failures, documentPath };
}

async function checkPdf(documentPath) {
  const failures = [];

  try {
    ensure(documentPath, "resolution document URL is missing");

    const worker = await fetch(`${APP_URL}/pdf.worker.min.mjs`);
    ensure(worker.ok, `pdf worker returned ${worker.status}`);

    const pdfUrl = new URL(documentPath, STRAPI_URL).toString();
    const pdf = await fetch(pdfUrl, {
      headers: {
        Origin: APP_URL,
        Range: "bytes=0-1023",
      },
    });

    ensure(pdf.ok, `pdf returned ${pdf.status}`);
    ensure(
      pdf.headers.get("access-control-allow-origin") === APP_URL,
      "pdf CORS origin does not match app URL",
    );
    ensure(
      (pdf.headers.get("content-type") || "").includes("application/pdf"),
      "pdf content-type is not application/pdf",
    );
  } catch (error) {
    failures.push(error.message);
  }

  return failures;
}

async function main() {
  const pageFailures = await checkPages();
  const { failures: cmsFailures, documentPath } = await checkCms();
  const pdfFailures = await checkPdf(documentPath);
  const failures = [...pageFailures, ...cmsFailures, ...pdfFailures];

  if (failures.length > 0) {
    console.error(
      JSON.stringify(
        {
          ok: false,
          appUrl: APP_URL,
          strapiUrl: STRAPI_URL,
          manager: MANAGER_SLUG,
          failures,
        },
        null,
        2,
      ),
    );
    process.exit(1);
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        appUrl: APP_URL,
        strapiUrl: STRAPI_URL,
        manager: MANAGER_SLUG,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
