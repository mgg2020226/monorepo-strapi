import { Container } from "@repo/design-system/elementary/Container"
import type { Data } from "@repo/strapi-types"

import type { PageBuilderComponentProps } from "@repo/sections/types"
import { StrapiMediaImage } from "@repo/sections/utilities/StrapiMediaImage"

export function StrapiGallery({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.gallery">
}) {
  const layout = component.layout ?? "grid"

  return (
    <Container>
      <section className="px-4 py-8 lg:py-12">
        {component.title && (
          <h2 className="text-3xl font-semibold">{component.title}</h2>
        )}
        {component.description && (
          <p className="text-muted-foreground mt-3 max-w-3xl">
            {component.description}
          </p>
        )}
        <div
          className={
            layout === "carousel"
              ? "mt-8 flex snap-x gap-4 overflow-x-auto pb-4"
              : layout === "masonry"
                ? "mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3"
                : "mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          }
        >
          {component.images?.map((image) => (
            <div
              key={image.id}
              className={
                layout === "carousel"
                  ? "relative aspect-video min-w-[min(85vw,32rem)] snap-start overflow-hidden rounded-2xl"
                  : "relative aspect-video overflow-hidden rounded-2xl"
              }
            >
              <StrapiMediaImage media={image} fill className="object-cover" />
            </div>
          ))}
        </div>
      </section>
    </Container>
  )
}

StrapiGallery.displayName = "StrapiGallery"
