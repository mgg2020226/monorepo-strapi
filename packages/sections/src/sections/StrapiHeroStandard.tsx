import { Container } from "@repo/design-system/elementary/Container"
import type { Data } from "@repo/strapi-types"

import type { PageBuilderComponentProps } from "@repo/sections/types"
import StrapiLink from "@repo/sections/utilities/StrapiLink"
import { StrapiMediaImage } from "@repo/sections/utilities/StrapiMediaImage"

export function StrapiHeroStandard({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.hero-standard">
}) {
  const centered = component.alignment === "center"

  return (
    <Container>
      <section className="grid gap-8 px-4 py-10 lg:grid-cols-2 lg:items-center lg:py-16">
        <div className={centered ? "text-center lg:col-span-2" : ""}>
          {component.eyebrow && (
            <p className="text-primary mb-3 text-sm font-semibold tracking-wide uppercase">
              {component.eyebrow}
            </p>
          )}
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            {component.title}
          </h1>
          {component.description && (
            <p className="text-muted-foreground mt-5 max-w-2xl text-lg">
              {component.description}
            </p>
          )}
          {component.actions?.length ? (
            <div className="mt-7 flex flex-wrap gap-3">
              {component.actions.map((action) => (
                <StrapiLink key={action.id} component={action} />
              ))}
            </div>
          ) : null}
        </div>
        {component.image && (
          <div className="relative min-h-64 overflow-hidden rounded-3xl lg:min-h-96">
            <StrapiMediaImage
              media={component.image}
              fill
              className="object-cover"
            />
          </div>
        )}
      </section>
    </Container>
  )
}

StrapiHeroStandard.displayName = "StrapiHeroStandard"
