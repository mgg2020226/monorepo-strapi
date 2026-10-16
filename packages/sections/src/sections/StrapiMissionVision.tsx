import "server-only"

import { Container } from "@repo/design-system/elementary/Container"
import type { Data } from "@repo/strapi-types"

import type { PageBuilderComponentProps } from "@repo/sections/types"
import { StrapiMediaImage } from "@repo/sections/utilities/StrapiMediaImage"

export function StrapiMissionVision({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.mission-vision">
}) {
  const entries = [
    {
      title: component.missionTitle,
      description: component.missionDescription,
      image: component.missionImage,
    },
    {
      title: component.visionTitle,
      description: component.visionDescription,
      image: component.visionImage,
    },
  ]

  return (
    <Container>
      <section className="px-4 py-12 sm:px-8 lg:py-20">
        {component.heading && (
          <h2 className="mx-auto mb-10 max-w-3xl text-center text-3xl font-bold tracking-tight md:text-4xl">
            {component.heading}
          </h2>
        )}
        <div className="grid gap-6 lg:grid-cols-2">
          {entries.map((entry) => (
            <article
              key={entry.title}
              className="bg-card overflow-hidden rounded-3xl border shadow-sm"
            >
              {entry.image && (
                <div className="bg-muted relative aspect-[16/8] overflow-hidden">
                  <StrapiMediaImage
                    media={entry.image}
                    alt={entry.title}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6 sm:p-8">
                <h3 className="text-2xl font-bold tracking-tight">
                  {entry.title}
                </h3>
                <p className="text-muted-foreground mt-4 leading-relaxed">
                  {entry.description}
                </p>
              </div>
            </article>
          ))}
        </div>
        {component.values?.length ? (
          <div className="mt-12 border-t pt-8">
            {component.valuesTitle && (
              <h3 className="text-center text-xl font-semibold">
                {component.valuesTitle}
              </h3>
            )}
            <ul className="mt-5 flex flex-wrap justify-center gap-3">
              {component.values.map((value) => (
                <li
                  key={value.id}
                  className="bg-secondary rounded-full px-4 py-2 text-sm font-medium"
                >
                  {value.text}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    </Container>
  )
}

StrapiMissionVision.displayName = "StrapiMissionVision"

export default StrapiMissionVision
