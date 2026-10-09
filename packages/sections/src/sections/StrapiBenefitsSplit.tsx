import "server-only"

import { Container } from "@repo/design-system/elementary/Container"
import type { Data } from "@repo/strapi-types"
import { Check } from "lucide-react"

import type { PageBuilderComponentProps } from "@repo/sections/types"
import { StrapiMediaImage } from "@repo/sections/utilities/StrapiMediaImage"

export function StrapiBenefitsSplit({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.benefits-split">
}) {
  return (
    <Container>
      <section className="px-4 py-10 sm:px-8 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-2">
          {component.panels?.map((panel) => (
            <article
              key={panel.id}
              className="bg-card overflow-hidden rounded-3xl border shadow-sm"
            >
              {panel.image && (
                <div className="bg-muted relative aspect-[16/8] overflow-hidden">
                  <StrapiMediaImage
                    media={panel.image.media}
                    alt={panel.image.alt ?? panel.title}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 hover:scale-[1.03]"
                  />
                </div>
              )}
              <div className="p-6 sm:p-8">
                {panel.eyebrow && (
                  <p className="text-primary text-sm font-semibold tracking-wide uppercase">
                    {panel.eyebrow}
                  </p>
                )}
                <h2 className="mt-2 text-2xl font-bold tracking-tight">
                  {panel.title}
                </h2>
                {panel.description && (
                  <p className="text-muted-foreground mt-2">
                    {panel.description}
                  </p>
                )}
                {panel.benefits?.length ? (
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {panel.benefits.map(
                      (benefit) =>
                        benefit.text && (
                          <li
                            key={benefit.id}
                            className="flex items-start gap-2 text-sm"
                          >
                            <Check
                              aria-hidden="true"
                              size={18}
                              className="text-primary mt-0.5 shrink-0"
                            />
                            <span>{benefit.text}</span>
                          </li>
                        )
                    )}
                  </ul>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </Container>
  )
}

StrapiBenefitsSplit.displayName = "StrapiBenefitsSplit"

export default StrapiBenefitsSplit
