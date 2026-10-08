import { Container } from "@repo/design-system/elementary/Container"
import type { Data } from "@repo/strapi-types"

import type { PageBuilderComponentProps } from "@repo/sections/types"
import { StrapiMediaImage } from "@repo/sections/utilities/StrapiMediaImage"

export function StrapiVideo({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.video">
}) {
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
        <div className="relative mt-8 overflow-hidden rounded-2xl bg-black">
          <video
            className="max-h-[70vh] w-full"
            controls
            autoPlay={component.autoplay ?? false}
            loop={component.loop ?? false}
            muted={component.muted ?? true}
            poster={component.poster?.url ?? undefined}
            playsInline
          >
            <source src={component.videoUrl ?? ""} />
          </video>
          {component.poster && !component.videoUrl && (
            <StrapiMediaImage
              media={component.poster}
              fill
              className="object-cover"
            />
          )}
        </div>
      </section>
    </Container>
  )
}

StrapiVideo.displayName = "StrapiVideo"
