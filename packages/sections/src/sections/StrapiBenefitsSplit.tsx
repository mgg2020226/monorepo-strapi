import "server-only"

import { Container } from "@repo/design-system/elementary/Container"
import { cn } from "@repo/design-system/utils"
import type { Data } from "@repo/strapi-types"
import { Check } from "lucide-react"

import type { PageBuilderComponentProps } from "@repo/sections/types"
import {
  sectionContainerClass,
  sectionContentClass,
  sectionStyleProps,
} from "@repo/sections/utilities/section-style"
import { StrapiMediaImage } from "@repo/sections/utilities/StrapiMediaImage"

export function StrapiBenefitsSplit({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.benefits-split">
}) {
  const styleProps = sectionStyleProps(component.style)

  return (
    <Container className={sectionContainerClass(component.style)}>
      <section
        {...styleProps}
        className={cn(
          styleProps.className,
          sectionContentClass(component.style, "px-4 sm:px-8")
        )}
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {component.panels?.map((panel) => (
            <article
              key={panel.id}
              className="section-style-item bg-card overflow-hidden rounded-3xl border shadow-sm"
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
