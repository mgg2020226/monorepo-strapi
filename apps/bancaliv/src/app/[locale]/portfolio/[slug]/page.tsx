import CkEditorRenderer from "@repo/design-system/elementary/ck-editor"
import { Container } from "@repo/design-system/elementary/Container"
import { StrapiMediaImage } from "@repo/sections/utilities/StrapiMediaImage"
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
        {project.coverImage && (
          <div className="bg-muted relative mb-8 aspect-[16/8] overflow-hidden rounded-3xl">
            <StrapiMediaImage
              media={project.coverImage}
              alt={project.title ?? ""}
              fill
              priority
              sizes="(min-width: 1024px) 896px, 100vw"
              className="object-cover"
            />
          </div>
        )}
        {project.category && (
          <p className="text-primary text-sm font-semibold tracking-wide uppercase">
            {project.category}
          </p>
        )}
        <h1 className="mt-2 text-4xl font-bold">{project.title}</h1>
        {project.summary && (
          <p className="text-muted-foreground mt-5 text-xl">
            {project.summary}
          </p>
        )}
        {(project.location || project.area || project.year) && (
          <dl className="mt-8 grid gap-4 rounded-2xl border p-5 sm:grid-cols-3">
            {project.location && (
              <div>
                <dt className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                  {t("projectLocation")}
                </dt>
                <dd className="mt-1 font-medium">{project.location}</dd>
              </div>
            )}
            {project.area && (
              <div>
                <dt className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                  {t("projectArea")}
                </dt>
                <dd className="mt-1 font-medium">{project.area}</dd>
              </div>
            )}
            {project.year && (
              <div>
                <dt className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                  {t("projectYear")}
                </dt>
                <dd className="mt-1 font-medium">{project.year}</dd>
              </div>
            )}
          </dl>
        )}
        {project.tag && (
          <p className="text-primary mt-5 text-sm font-semibold">
            {project.tag}
          </p>
        )}
        {project.services && (
          <p className="text-muted-foreground mt-5 leading-relaxed">
            {project.services}
          </p>
        )}
        <CkEditorRenderer htmlContent={project.content} className="mt-10" />
        {(project.challenge || project.solution || project.result) && (
          <div className="mt-12 space-y-8">
            {project.challenge && (
              <section>
                <h2 className="text-2xl font-semibold">
                  {t("projectChallenge")}
                </h2>
                <p className="text-muted-foreground mt-3 leading-relaxed">
                  {project.challenge}
                </p>
              </section>
            )}
            {project.solution && (
              <section>
                <h2 className="text-2xl font-semibold">
                  {t("projectSolution")}
                </h2>
                <p className="text-muted-foreground mt-3 leading-relaxed">
                  {project.solution}
                </p>
              </section>
            )}
            {project.result && (
              <section>
                <h2 className="text-2xl font-semibold">{t("projectResult")}</h2>
                <p className="text-muted-foreground mt-3 leading-relaxed">
                  {project.result}
                </p>
              </section>
            )}
          </div>
        )}
        {project.technologies?.length ? (
          <ul className="mt-8 flex flex-wrap gap-2">
            {project.technologies.map((technology) => (
              <li
                key={technology.id}
                className="bg-secondary rounded-full px-4 py-2 text-sm font-medium"
              >
                {technology.label}
              </li>
            ))}
          </ul>
        ) : null}
        {project.gallery?.length ? (
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {project.gallery.map((image) => (
              <div
                key={image.id}
                className="bg-muted relative aspect-[4/3] overflow-hidden rounded-2xl"
              >
                <StrapiMediaImage
                  media={image}
                  alt={image.alternativeText ?? project.title ?? ""}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        ) : null}
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
