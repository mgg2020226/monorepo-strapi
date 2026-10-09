import CkEditorRenderer from "@repo/design-system/elementary/ck-editor"
import { Container } from "@repo/design-system/elementary/Container"
import { normalizePageFullPath } from "@repo/shared-data"
import { notFound } from "next/navigation"
import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { Breadcrumbs } from "@/components/elementary/Breadcrumbs"
import { getMetadataFromStrapi } from "@/lib/metadata"
import { isValidLocale } from "@/lib/navigation"
import { fetchLegalPage } from "@/lib/strapi-api/content/server"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!isValidLocale(locale)) return null

  return getMetadataFromStrapi({
    locale,
    slug,
    pathPrefix: "/legal",
    uid: "api::legal-page.legal-page",
  })
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: rawLocale, slug } = await params
  if (!isValidLocale(rawLocale)) notFound()
  const locale = rawLocale as Locale
  const t = await getTranslations({ locale, namespace: "content" })
  const page = (await fetchLegalPage(slug, locale)).data
  if (!page) notFound()

  return (
    <Container className="px-4 py-12">
      <Breadcrumbs
        locale={locale}
        breadcrumbs={[
          {
            title: t("legal"),
            fullPath: normalizePageFullPath(["/legal"], locale),
          },
          {
            title: page.title ?? "",
            fullPath: normalizePageFullPath(["/legal", slug], locale),
          },
        ]}
      />
      <article className="mx-auto max-w-224">
        <h1 className="text-4xl font-bold">{page.title}</h1>
        {page.effectiveDate && (
          <p className="text-muted-foreground mt-3">
            {String(page.effectiveDate)}
          </p>
        )}
        <CkEditorRenderer htmlContent={page.content} className="mt-10" />
        <a
          href={normalizePageFullPath(["/legal"], locale)}
          className="mt-10 inline-block underline"
        >
          {t("backToLegal")}
        </a>
      </article>
    </Container>
  )
}
