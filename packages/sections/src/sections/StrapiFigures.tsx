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
      <Container className="flex flex-col justify-between gap-6 md:w-2/3 lg:flex-row">
        {component.figures?.map((figure) => (
          <StrapiFigure key={figure.id} component={figure} />
        ))}
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
    <div className="flex flex-col items-center">
      <Typography tag="h2" className="text-center font-bold">
        {prefix}
        {number}
        {suffix}
      </Typography>
      <CkEditorRenderer htmlContent={description} />
    </div>
  )
}
