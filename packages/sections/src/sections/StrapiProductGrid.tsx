import "server-only"

import { Container } from "@repo/design-system/elementary/Container"
import type { Data } from "@repo/strapi-types"

import type { PageBuilderComponentProps } from "@repo/sections/types"
import StrapiLink from "@repo/sections/utilities/StrapiLink"
import { StrapiMediaImage } from "@repo/sections/utilities/StrapiMediaImage"

export function StrapiProductGrid({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.product-grid">
}) {
  const count = component.products?.length ?? 0
  const columns =
    count >= 4
      ? "lg:grid-cols-4"
      : count === 3
        ? "lg:grid-cols-3"
        : "lg:grid-cols-2"

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
          <div className={`mt-10 grid gap-5 sm:grid-cols-2 ${columns}`}>
            {component.products?.map((product) => (
              <article
                key={product.id}
                className="group bg-card flex min-h-64 flex-col rounded-2xl border p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg"
              >
                {product.image && (
                  <div className="bg-primary/10 mb-5 flex size-16 items-center justify-center overflow-hidden rounded-2xl p-2">
                    <StrapiMediaImage
                      media={product.image.media}
                      alt={product.image.alt ?? product.title}
                      width={56}
                      height={56}
                      className="size-full object-contain"
                    />
                  </div>
                )}
                <h3 className="text-xl font-semibold">{product.title}</h3>
                {product.description && (
                  <p className="text-muted-foreground mt-2 flex-1 leading-relaxed">
                    {product.description}
                  </p>
                )}
                {product.action && (
                  <StrapiLink
                    component={product.action}
                    className="mt-5 self-start"
                  />
                )}
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

StrapiProductGrid.displayName = "StrapiProductGrid"

export default StrapiProductGrid
