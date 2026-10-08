import { Container } from "@repo/design-system/elementary/Container"
import type { Data } from "@repo/strapi-types"

import type { PageBuilderComponentProps } from "@repo/sections/types"
import StrapiLink from "@repo/sections/utilities/StrapiLink"

export function StrapiCta({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.cta">
}) {
  return (
    <Container>
      <section className="bg-primary text-primary-foreground mx-4 rounded-3xl px-6 py-10 text-center md:px-12">
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
