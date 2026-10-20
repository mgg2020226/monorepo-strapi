import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { compileStrapi, createStrapi } from "@strapi/strapi"

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const fixturePath = path.resolve(scriptDir, "../seed-data/nexon-group.es.json")
const fixture = JSON.parse(await readFile(fixturePath, "utf8"))
const siteSlugs = ["nexon", "nexon-group"]
const locales = ["es", "en"]

const strapiContext = await compileStrapi()
const strapi = await createStrapi(strapiContext).load()

async function findNexonSite() {
  return strapi.documents("api::site.site").findFirst({
    status: "draft",
    filters: { slug: { $in: siteSlugs } },
    populate: { pages: { fields: ["documentId"] } },
  })
}

async function deleteSitePages(siteSlug) {
  const documentIds = new Set()
  for (const locale of locales) {
    const pages = await strapi.documents("api::page.page").findMany({
      status: "draft",
      locale,
      filters: { site: { slug: siteSlug } },
      fields: ["documentId"],
      limit: 500,
    })
    for (const page of pages) documentIds.add(page.documentId)
  }
  for (const documentId of documentIds) {
    await strapi.documents("api::page.page").delete({ documentId })
  }
  return documentIds.size
}

async function deleteSiteForms(siteSlug) {
  const forms = await strapi.documents("api::form-definition.form-definition").findMany({
    status: "draft",
    locale: "es",
    filters: { site: { slug: siteSlug } },
    fields: ["documentId"],
    limit: 500,
  })
  for (const form of forms) {
    await strapi.documents("api::form-definition.form-definition").delete({
      documentId: form.documentId,
      locale: "es",
    })
  }
  return forms.length
}

try {
  const existingSite = await findNexonSite()
  const siteData = { ...fixture.site }

  const site = existingSite
    ? await strapi.documents("api::site.site").update({
        documentId: existingSite.documentId,
        data: siteData,
        status: "published",
      })
    : await strapi.documents("api::site.site").create({
        data: siteData,
        status: "published",
      })

  const deletedPages = await deleteSitePages("nexon-group")
  const deletedForms = await deleteSiteForms("nexon-group")

  const page = await strapi.documents("api::page.page").create({
    locale: "es",
    status: "published",
    data: {
      ...fixture.page,
      site: site.documentId,
    },
  })

  console.info(JSON.stringify({
    site: site.slug,
    page: page.fullPath,
    locale: "es",
    registeredSections: fixture.page.content.length,
    replacedPages: deletedPages,
    replacedForms: deletedForms,
    contactFormActive: false,
    note: "Nexon contact forms were removed and no new form was created; the contact section remains on the page.",
  }, null, 2))
} finally {
  await strapi.destroy()
}
