import { StrapiCta } from "@repo/sections/sections/StrapiCta"
import type { PageBuilderComponentProps } from "@repo/sections/types"
import type { Data } from "@repo/strapi-types"

export function BancalivCta({
  component,
  page,
  pageParams,
  searchParams,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.cta">
}) {
  return (
    <StrapiCta
      component={component}
      page={page}
      pageParams={pageParams}
      searchParams={searchParams}
      className="bancaliv-cta-banner"
    />
  )
}

export default BancalivCta
