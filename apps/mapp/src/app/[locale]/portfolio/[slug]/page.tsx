import CkEditorRenderer from "@repo/design-system/elementary/ck-editor"
import { Container } from "@repo/design-system/elementary/Container"
import { normalizePageFullPath } from "@repo/shared-data"
import { notFound } from "next/navigation"
import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { Breadcrumbs } from "@/components/elementary/Breadcrumbs"
import { getMetadataFromStrapi } from "@/lib/metadata"
import { isValidLocale } from "@/lib/navigation"
import { fetchPortfolioProject } from "@/lib/strapi-api/content/server"

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
    pathPrefix: "/portfolio",
    uid: "api::portfolio-project.portfolio-project",
  })
}

export default async function PortfolioProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: rawLocale, slug } = await params
  if (!isValidLocale(rawLocale)) notFound()
  const locale = rawLocale as Locale
  const t = await getTranslations({ locale, namespace: "content" })
  const project = (await fetchPortfolioProject(slug, locale)).data
  if (!project) notFound()

  return (
    <Container className="px-4 py-12">
      <Breadcrumbs
        locale={locale}
        breadcrumbs={[
          {
            title: t("portfolio"),
            fullPath: normalizePageFullPath(["/portfolio"], locale),
          },
          {
            title: project.title ?? "",
            fullPath: normalizePageFullPath(["/portfolio", slug], locale),
          },
        ]}
      />
      <article className="mx-auto max-w-224">
        <h1 className="text-4xl font-bold">{project.title}</h1>
        {project.summary && (
          <p className="text-muted-foreground mt-5 text-xl">
            {project.summary}
          </p>
        )}
        <CkEditorRenderer htmlContent={project.content} className="mt-10" />
        <a
          href={normalizePageFullPath(["/portfolio"], locale)}
          className="mt-10 inline-block underline"
        >
          {t("backToPortfolio")}
        </a>
      </article>
    </Container>
  )
}
