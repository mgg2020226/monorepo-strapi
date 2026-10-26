import { ChartNoAxesCombined, Gift, Landmark, ShoppingBag } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"

const productIcons = [ShoppingBag, Gift, ChartNoAxesCombined, Landmark]

type Product = {
  id: number | string
  title?: string | null
  description?: string | null
  image?: ReactNode
  action?: ReactNode
}

export function BancalivProductGrid({
  sectionProps,
  containerClass,
  contentClass,
  title,
  description,
  products = [],
}: {
  sectionProps: ComponentProps<"section">
  containerClass?: string
  contentClass?: string
  title?: string | null
  description?: string | null
  products?: Product[]
}) {
  const count = products.length
  const columns =
    count >= 4
      ? "lg:grid-cols-4"
      : count === 3
        ? "lg:grid-cols-3"
        : "lg:grid-cols-2"

  return (
    <section {...sectionProps}>
      <div className={containerClass}>
        <div className={contentClass}>
          <header className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              {title}
            </h2>
            {description && (
              <p className="text-muted-foreground mt-4">{description}</p>
            )}
          </header>
          <div className={`mt-10 grid gap-5 sm:grid-cols-2 ${columns}`}>
            {products.map((product, index) => {
              const Icon =
                productIcons[index % productIcons.length] ?? ShoppingBag

              return (
                <article
                  key={product.id}
                  className="bancaliv-product-card section-style-item group bg-card flex min-h-64 flex-col rounded-2xl border p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <div
                    className={`bancaliv-product-card__icon mb-5 flex size-16 items-center justify-center overflow-hidden rounded-2xl p-2 ${index % 2 === 1 ? "bancaliv-product-card__icon--purple" : ""}`}
                  >
                    {product.image ?? (
                      <Icon aria-hidden="true" size={34} strokeWidth={1.8} />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold">{product.title}</h3>
                  {product.description && (
                    <p className="text-muted-foreground mt-2 flex-1 leading-relaxed">
                      {product.description}
                    </p>
                  )}
                  {product.action}
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
