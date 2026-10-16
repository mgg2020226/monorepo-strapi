import "server-only"

import { Container } from "@repo/design-system/elementary/Container"
import type { Data } from "@repo/strapi-types"

import BeforeAfterSliderControl from "@repo/sections/sections/BeforeAfterSliderControl"
import type { PageBuilderComponentProps } from "@repo/sections/types"

export function StrapiBeforeAfterSlider({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.before-after-slider">
}) {
  return (
    <Container>
      <section className="grid items-center gap-10 px-4 py-10 lg:grid-cols-2 lg:gap-14 lg:py-16">
        <div>
          {component.title && (
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              {component.title}
            </h2>
          )}
          {component.description && (
            <p className="text-muted-foreground mt-5 leading-relaxed">
              {component.description}
            </p>
          )}
          {component.hint && (
            <p className="text-primary mt-4 text-sm font-medium">
              {component.hint}
            </p>
          )}
        </div>
        <BeforeAfterSliderControl component={component} />
      </section>
    </Container>
  )
}

StrapiBeforeAfterSlider.displayName = "StrapiBeforeAfterSlider"

export default StrapiBeforeAfterSlider
