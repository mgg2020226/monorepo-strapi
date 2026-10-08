import CKEditorRenderer from "@repo/design-system/elementary/ck-editor"
import { Container } from "@repo/design-system/elementary/Container"
import type { Data } from "@repo/strapi-types"

import type { PageBuilderComponentProps } from "@repo/sections/types"

export function StrapiCkEditorContent({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"utilities.ck-editor-content">
}) {
  return (
    <Container>
      <CKEditorRenderer
        htmlContent={component.content}
        className="mx-auto w-full max-w-324 px-4 py-8 lg:py-12"
      />
    </Container>
  )
}

StrapiCkEditorContent.displayName = "CkEditorContent"

export default StrapiCkEditorContent
