import CkEditorRenderer from "@repo/design-system/elementary/ck-editor"
import { Container } from "@repo/design-system/elementary/Container"
import { cn } from "@repo/design-system/utils"
import type { Data } from "@repo/strapi-types"

import type { PageBuilderComponentProps } from "@repo/sections/types"

export function StrapiContentRichText({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.content-rich-text">
}) {
  return (
    <Container>
      <div className={cn("mx-auto max-w-224 px-4 py-8 lg:py-12")}>
        {component.eyebrow && (
          <p className="text-primary mb-3 text-sm font-semibold tracking-wide uppercase">
            {component.eyebrow}
          </p>
        )}
        {component.title && (
          <h2 className="mb-6 text-3xl font-semibold tracking-tight">
            {component.title}
          </h2>
        )}
        <CkEditorRenderer htmlContent={component.body} />
      </div>
    </Container>
  )
}

StrapiContentRichText.displayName = "StrapiContentRichText"
