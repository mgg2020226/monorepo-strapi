import "server-only"

import { Container } from "@repo/design-system/elementary/Container"
import type { Data } from "@repo/strapi-types"
import { Quote } from "lucide-react"

import type { PageBuilderComponentProps } from "@repo/sections/types"
import { StrapiMediaImage } from "@repo/sections/utilities/StrapiMediaImage"

export function StrapiTestimonials({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.testimonials">
}) {
  const columns =
    (component.items?.length ?? 0) >= 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"

  return (
    <section className="bg-primary/5">
      <Container>
        <div className="px-4 py-12 sm:px-8 lg:py-16">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              {component.title}
            </h2>
            {component.description && (
              <p className="text-muted-foreground mt-4">
                {component.description}
              </p>
            )}
          </header>
          <div className={`mt-10 grid gap-5 ${columns}`}>
            {component.items?.map((item) => (
              <figure
                key={item.id}
                className="bg-card flex h-full flex-col rounded-2xl border p-6 shadow-sm sm:p-8"
              >
                <Quote
                  aria-hidden="true"
                  size={28}
                  className="text-primary/70"
                />
                <blockquote className="mt-4 flex-1 leading-relaxed">
                  “{item.quote}”
                </blockquote>
                <figcaption className="mt-7 flex items-center gap-3 border-t pt-5">
                  {item.avatar && (
                    <StrapiMediaImage
                      media={item.avatar.media}
                      alt={item.avatar.alt ?? item.authorName}
                      width={48}
                      height={48}
                      className="size-12 rounded-full object-cover"
                    />
                  )}
                  <span>
                    <span className="block font-semibold">
                      {item.authorName}
                    </span>
                    {item.authorRole && (
                      <span className="text-muted-foreground mt-0.5 block text-sm">
                        {item.authorRole}
                      </span>
                    )}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

StrapiTestimonials.displayName = "StrapiTestimonials"

export default StrapiTestimonials
