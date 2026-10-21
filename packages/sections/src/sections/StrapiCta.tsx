import { Container } from "@repo/design-system/elementary/Container"
import { cn } from "@repo/design-system/utils"
import type { Data } from "@repo/strapi-types"

import type { PageBuilderComponentProps } from "@repo/sections/types"
import {
  sectionContentClass,
  sectionStyleProps,
} from "@repo/sections/utilities/section-style"
import StrapiLink from "@repo/sections/utilities/StrapiLink"

export function StrapiCta({
  component,
  className,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.cta">
  className?: string
}) {
  const styleProps = sectionStyleProps(component.style)

  return (
    <Container>
      <section
        {...styleProps}
        className={cn(
          styleProps.className,
          className,
          sectionContentClass(
            component.style,
            "mx-4 rounded-3xl p-8 text-center sm:p-12 lg:p-16"
          )
        )}
      >
        <h2 className="text-3xl font-semibold">{component.title}</h2>
        {component.description && (
          <p className="mx-auto mt-3 max-w-2xl opacity-90">
            {component.description}
          </p>
        )}
        {component.actions?.length ? (
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {component.actions.map((action) => (
              <StrapiLink key={action.id} component={action} />
            ))}
          </div>
        ) : null}
      </section>
    </Container>
  )
}

StrapiCta.displayName = "StrapiCta"
