import { Container } from "@repo/design-system/elementary/Container"
import { normalizePageFullPath } from "@repo/shared-data"
import { notFound } from "next/navigation"
import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { ContentCard } from "@/components/content/ContentCard"
import { isValidLocale } from "@/lib/navigation"
import { fetchPortfolioProjects } from "@/lib/strapi-api/content/server"

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  if (!isValidLocale(rawLocale)) notFound()
  const locale = rawLocale as Locale
  const t = await getTranslations({ locale, namespace: "content" })
  const response = await fetchPortfolioProjects(locale)

  return (
    <Container className="px-4 py-12">
      <h1 className="text-4xl font-bold">{t("portfolio")}</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {response.data.map((project) => (
          <ContentCard
            key={project.documentId}
            href={normalizePageFullPath(
              ["/portfolio", project.slug ?? ""],
              locale
            )}
            title={project.title ?? ""}
            description={project.summary}
            readMoreLabel={t("readMore")}
          />
        ))}
      </div>
    </Container>
  )
}
