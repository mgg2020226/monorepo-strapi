import { Container } from "@repo/design-system/elementary/Container"
import { normalizePageFullPath } from "@repo/shared-data"
import { notFound } from "next/navigation"
import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { ContentCard } from "@/components/content/ContentCard"
import { isValidLocale } from "@/lib/navigation"
import { fetchLegalPages } from "@/lib/strapi-api/content/server"

export default async function LegalIndex({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  if (!isValidLocale(rawLocale)) notFound()
  const locale = rawLocale as Locale
  const t = await getTranslations({ locale, namespace: "content" })
  const response = await fetchLegalPages(locale)

  return (
    <Container className="px-4 py-12">
      <h1 className="text-4xl font-bold">{t("legal")}</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {response.data.map((page) => (
          <ContentCard
            key={page.documentId}
            href={normalizePageFullPath(["/legal", page.slug ?? ""], locale)}
            title={page.title ?? ""}
            meta={page.legalType}
            readMoreLabel={t("readMore")}
          />
        ))}
      </div>
    </Container>
  )
}
