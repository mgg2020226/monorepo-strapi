import "server-only"

import { Container } from "@repo/design-system/elementary/Container"
import type { Data } from "@repo/strapi-types"

import type { PageBuilderComponentProps } from "@repo/sections/types"
import { StrapiMediaImage } from "@repo/sections/utilities/StrapiMediaImage"

export function StrapiLogoCloud({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.logo-cloud">
}) {
  const layout = component.layout ?? "grid"
  const logos = component.logos ?? []

  return (
    <Container>
      <section className="px-4 py-10 sm:px-8 lg:py-14">
        <header className="mx-auto max-w-3xl text-center">
          {component.eyebrow && (
            <p className="text-primary text-sm font-bold tracking-[0.16em] uppercase">
              {component.eyebrow}
            </p>
          )}
          <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            {component.title}
          </h2>
          {component.description && (
            <p className="text-muted-foreground mt-4 leading-relaxed">
              {component.description}
            </p>
          )}
        </header>
        <ul
          className={
            layout === "strip"
              ? "mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-8"
              : "mt-10 grid grid-cols-2 items-center gap-4 sm:grid-cols-3 lg:grid-cols-4"
          }
        >
          {logos.map((item) => {
            if (!item.image) return null

            return (
              <li
                key={item.id}
                className={
                  layout === "strip"
                    ? "flex min-h-16 items-center justify-center"
                    : "bg-card flex min-h-28 items-center justify-center rounded-2xl border px-6 py-5"
                }
              >
                {item.href && isSafeLink(item.href) ? (
                  <a
                    href={item.href}
                    target={/^https?:/i.test(item.href) ? "_blank" : undefined}
                    rel={
                      /^https?:/i.test(item.href)
                        ? "noopener noreferrer"
                        : undefined
                    }
                    aria-label={item.image.alt ?? "Abrir sitio del aliado"}
                  >
                    <StrapiMediaImage
                      media={item.image.media}
                      alt={item.image.alt}
                      width={180}
                      height={72}
                      className="max-h-16 w-auto object-contain"
                    />
                  </a>
                ) : (
                  <StrapiMediaImage
                    media={item.image.media}
                    alt={item.image.alt}
                    width={180}
                    height={72}
                    className="max-h-16 w-auto object-contain"
                  />
                )}
              </li>
            )
          })}
        </ul>
      </section>
    </Container>
  )
}

function isSafeLink(href: string) {
  return /^(https?:|mailto:|tel:|\/|#)/i.test(href)
}

StrapiLogoCloud.displayName = "StrapiLogoCloud"

export default StrapiLogoCloud
