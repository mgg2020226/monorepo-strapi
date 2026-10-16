import "server-only"

import { Container } from "@repo/design-system/elementary/Container"
import type { Data } from "@repo/strapi-types"

import type { PageBuilderComponentProps } from "@repo/sections/types"
import StrapiLink from "@repo/sections/utilities/StrapiLink"
import { StrapiMediaImage } from "@repo/sections/utilities/StrapiMediaImage"

export function StrapiPortfolioProjects({
  component,
  pageParams,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.portfolio-projects">
}) {
  const projects = component.projects ?? []
  const locale = pageParams?.locale
  const [featuredProject, ...otherProjects] = projects
  const featuredOnly = component.variant === "featured"
  const showFeatured =
    component.variant === "featured" ||
    component.variant === "featured-plus-grid"
  const gridProjects =
    component.variant === "featured-plus-grid" ? otherProjects : projects

  return (
    <Container>
      <section className="px-4 py-12 sm:px-8 lg:py-20">
        {(component.title || component.description) && (
          <header className="mx-auto max-w-3xl text-center">
            {component.title && (
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                {component.title}
              </h2>
            )}
            {component.description && (
              <p className="text-muted-foreground mt-4 leading-relaxed">
                {component.description}
              </p>
            )}
          </header>
        )}

        {showFeatured && featuredProject ? (
          <a
            href={projectPath(featuredProject.slug, locale)}
            className="group bg-card mt-10 grid overflow-hidden rounded-3xl border shadow-sm transition-shadow hover:shadow-xl lg:grid-cols-2"
          >
            <div className="bg-muted relative aspect-[4/3] lg:aspect-auto lg:min-h-[28rem]">
              <StrapiMediaImage
                media={featuredProject.coverImage}
                alt={featuredProject.title ?? ""}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
              {featuredProject.category && (
                <p className="text-primary text-sm font-bold tracking-wider uppercase">
                  {featuredProject.category}
                </p>
              )}
              <h3 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                {featuredProject.title}
              </h3>
              {featuredProject.location && (
                <p className="text-muted-foreground mt-3 text-sm font-medium">
                  {featuredProject.location}
                </p>
              )}
              {featuredProject.summary && (
                <p className="text-muted-foreground mt-5 leading-relaxed">
                  {featuredProject.summary}
                </p>
              )}
              {featuredProject.services && (
                <p className="mt-5 text-sm font-medium">
                  {featuredProject.services}
                </p>
              )}
            </div>
          </a>
        ) : null}

        {gridProjects.length > 0 && !featuredOnly ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {gridProjects.map((project) => (
              <a
                key={project.documentId}
                href={projectPath(project.slug, locale)}
                className="group bg-card overflow-hidden rounded-2xl border shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="bg-muted relative aspect-[4/3] overflow-hidden">
                  <StrapiMediaImage
                    media={project.coverImage}
                    alt={project.title ?? ""}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  {(project.tag || project.category) && (
                    <p className="text-primary text-xs font-bold tracking-wider uppercase">
                      {project.tag ?? project.category}
                    </p>
                  )}
                  <h3 className="mt-2 text-lg font-semibold">
                    {project.title}
                  </h3>
                  {project.summary && (
                    <p className="text-muted-foreground mt-2 line-clamp-3 text-sm leading-relaxed">
                      {project.summary}
                    </p>
                  )}
                  {project.location && (
                    <p className="text-muted-foreground mt-4 text-xs">
                      {project.location}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        ) : null}

        {component.viewAllAction && (
          <div className="mt-8 flex justify-center">
            <StrapiLink component={component.viewAllAction} />
          </div>
        )}
      </section>
    </Container>
  )
}

function projectPath(slug: string | null | undefined, locale?: string) {
  if (!slug) return "#"
  const path = `/portfolio/${slug}`

  return locale && locale !== "es" ? `/${locale}${path}` : path
}

StrapiPortfolioProjects.displayName = "StrapiPortfolioProjects"

export default StrapiPortfolioProjects
