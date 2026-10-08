import CkEditorRenderer from "@repo/design-system/elementary/ck-editor"
import { Container } from "@repo/design-system/elementary/Container"
import { cn } from "@repo/design-system/utils"
import type { Data } from "@repo/strapi-types"

import type { PageBuilderComponentProps } from "@repo/sections/types"
import StrapiLink from "@repo/sections/utilities/StrapiLink"

export function StrapiFeatureGrid({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.feature-grid">
}) {
  const columns = component.columnsDesktop ?? 3

  return (
    <Container>
      <section className="px-4 py-8 lg:py-12">
        {component.eyebrow && (
          <p className="text-primary mb-3 text-sm font-semibold tracking-wide uppercase">
            {component.eyebrow}
          </p>
        )}
        <h2 className="text-3xl font-semibold tracking-tight">
          {component.title}
        </h2>
        {component.description && (
          <p className="text-muted-foreground mt-3 max-w-3xl">
            {component.description}
          </p>
        )}
        <div
          className={cn(
            "mt-8 grid grid-cols-1 gap-6",
            component.columnsMobile === 2 && "sm:grid-cols-2",
            columns >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
          )}
        >
          {component.items?.map((item) => (
            <article key={item.id} className="rounded-2xl border p-6 shadow-sm">
              {item.icon && (
                <div className="text-primary mb-4 text-2xl">{item.icon}</div>
              )}
              <h3 className="text-xl font-semibold">{item.title}</h3>
              {item.description && (
                <CkEditorRenderer
                  htmlContent={item.description}
                  className="mt-3"
                />
              )}
              {item.link && (
                <StrapiLink component={item.link} className="mt-4" />
              )}
            </article>
          ))}
        </div>
      </section>
    </Container>
  )
}

StrapiFeatureGrid.displayName = "StrapiFeatureGrid"
