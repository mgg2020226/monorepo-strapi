import CkEditorRenderer from "@repo/design-system/elementary/ck-editor"
import { Container } from "@repo/design-system/elementary/Container"
import Typography from "@repo/design-system/typography"
import type { Data } from "@repo/strapi-types"

import type { PageBuilderComponentProps } from "@repo/sections/types"

export function StrapiStatistics({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.statistics">
}) {
  return (
    <section>
      <Container>
        <div className="px-4 py-10 sm:px-8 lg:py-14">
          {(component.title || component.description) && (
            <header className="mx-auto mb-10 max-w-2xl text-center">
              {component.title && (
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  {component.title}
                </h2>
              )}
              {component.description && (
                <p className="text-muted-foreground mt-4">
                  {component.description}
                </p>
              )}
            </header>
          )}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {component.figures?.map((figure) => (
              <StrapiFigure key={figure.id} component={figure} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

function StrapiFigure({
  component,
}: {
  readonly component: Data.Component<"shared.figure">
}) {
  const { number, prefix, suffix, description } = component

  return (
    <div className="bg-card rounded-2xl border p-7 shadow-sm">
      <Typography tag="h3" className="text-primary text-start font-bold">
        {prefix}
        {number}
        {suffix}
      </Typography>
      <CkEditorRenderer
        htmlContent={description}
        className="text-muted-foreground mt-2 text-sm"
      />
    </div>
  )
}
