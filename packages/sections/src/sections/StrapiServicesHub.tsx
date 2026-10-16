import "server-only"

import { Container } from "@repo/design-system/elementary/Container"
import type { Data } from "@repo/strapi-types"
import { ArrowUpRight } from "lucide-react"

import type { PageBuilderComponentProps } from "@repo/sections/types"
import StrapiLink from "@repo/sections/utilities/StrapiLink"
import { StrapiMediaImage } from "@repo/sections/utilities/StrapiMediaImage"

export function StrapiServicesHub({
  component,
  pageParams,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.services-hub">
}) {
  return (
    <Container>
      <section className="px-4 py-12 sm:px-8 lg:py-20">
        <header className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {component.heading}
          </h2>
          {component.description && (
            <p className="text-muted-foreground mt-4 leading-relaxed">
              {component.description}
            </p>
          )}
        </header>
        <div className="mt-12 flex flex-col gap-14 lg:gap-20">
          {component.cards?.map((card, index) => (
            <article
              key={card.id}
              className={`grid items-center gap-8 lg:grid-cols-12 lg:gap-12 ${index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
            >
              <div className="lg:col-span-7">
                <div className="bg-muted relative aspect-[16/10] overflow-hidden rounded-2xl">
                  <StrapiMediaImage
                    media={card.image?.media}
                    alt={card.image?.alt ?? card.title}
                    fill
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="lg:col-span-5">
                <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {card.title}
                </h3>
                {card.whatWeDo && (
                  <p className="text-muted-foreground mt-4 leading-relaxed">
                    {card.whatWeDo}
                  </p>
                )}
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  {card.specialties?.length ? (
                    <div>
                      {component.specialtiesTitle && (
                        <h4 className="text-primary text-xs font-bold tracking-wider uppercase">
                          {component.specialtiesTitle}
                        </h4>
                      )}
                      <ul className="text-muted-foreground mt-2 space-y-2 text-sm">
                        {card.specialties.map((item) => (
                          <li key={item.id}>{item.label}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {card.benefits?.length ? (
                    <div>
                      {component.benefitsTitle && (
                        <h4 className="text-primary text-xs font-bold tracking-wider uppercase">
                          {component.benefitsTitle}
                        </h4>
                      )}
                      <ul className="text-muted-foreground mt-2 space-y-2 text-sm">
                        {card.benefits.map((item) => (
                          <li key={item.id}>{item.label}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
                {card.action && (
                  <div className="mt-6">
                    <StrapiLink component={card.action} />
                  </div>
                )}
                {card.relatedProject?.slug && (
                  <a
                    href={portfolioPath(
                      card.relatedProject.slug,
                      pageParams?.locale
                    )}
                    className="text-primary mt-5 inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"
                  >
                    {card.relatedProjectLabel ??
                      component.relatedProjectLabel ??
                      card.relatedProject.title}
                    <ArrowUpRight aria-hidden="true" size={16} />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </Container>
  )
}

function portfolioPath(slug: string, locale?: string) {
  const path = `/portfolio/${slug}`

  return locale && locale !== "es" ? `/${locale}${path}` : path
}

StrapiServicesHub.displayName = "StrapiServicesHub"

export default StrapiServicesHub
