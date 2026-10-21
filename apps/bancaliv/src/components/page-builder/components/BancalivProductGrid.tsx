import { BancalivProductGrid as BancalivProductGridView } from "@repo/design-system/bancaliv"
import type { PageBuilderComponentProps } from "@repo/sections/types"
import {
  sectionContainerClass,
  sectionContentClass,
  sectionStyleProps,
} from "@repo/sections/utilities/section-style"
import StrapiLink from "@repo/sections/utilities/StrapiLink"
import { StrapiMediaImage } from "@repo/sections/utilities/StrapiMediaImage"
import type { Data } from "@repo/strapi-types"

export function BancalivProductGrid({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.product-grid">
}) {
  return (
    <BancalivProductGridView
      sectionProps={sectionStyleProps(component.style)}
      containerClass={sectionContainerClass(component.style)}
      contentClass={sectionContentClass(component.style, "px-4 sm:px-8")}
      title={component.title}
      description={component.description}
      products={(component.products ?? []).map((product) => ({
        id: product.id,
        title: product.title,
        description: product.description,
        image: product.image ? (
          <StrapiMediaImage
            media={product.image.media}
            alt={product.image.alt ?? product.title}
            width={56}
            height={56}
            className="size-full object-contain"
          />
        ) : undefined,
        action: product.action ? (
          <StrapiLink component={product.action} className="mt-5 self-start" />
        ) : undefined,
      }))}
    />
  )
}
