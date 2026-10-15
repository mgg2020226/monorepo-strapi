import CkEditorRenderer from "@repo/design-system/elementary/ck-editor"
import { Container } from "@repo/design-system/elementary/Container"
import Typography from "@repo/design-system/typography"
import { cn } from "@repo/design-system/utils"
import type { Data } from "@repo/strapi-types"

import type { PageBuilderComponentProps } from "@repo/sections/types"
import {
  sectionContainerClass,
  sectionContentClass,
  sectionStyleProps,
} from "@repo/sections/utilities/section-style"

export function StrapiStatistics({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.statistics">
}) {
  const styleProps = sectionStyleProps(component.style)
  const rowLayout = component.style?.layout !== "grid"

  return (
    <section {...styleProps}>
      <Container className={sectionContainerClass(component.style)}>
        <div className={sectionContentClass(component.style, "px-4 sm:px-8")}>
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
          <div
            className={cn(
              "section-style-list gap-5",
              rowLayout
                ? "flex flex-wrap justify-center lg:flex-nowrap"
                : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            )}
          >
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
    <div className="section-style-item bg-card w-full rounded-2xl border p-6 text-center shadow-sm lg:p-8">
      <Typography tag="h3" className="text-primary text-center font-bold">
        {prefix}
        {number}
        {suffix}
      </Typography>
      <CkEditorRenderer
        htmlContent={description}
        className="text-muted-foreground mt-2 text-center text-sm"
      />
    </div>
  )
}
