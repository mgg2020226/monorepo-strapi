import { Container } from "@repo/design-system/elementary/Container"
import { TiptapRichText } from "@repo/design-system/elementary/tiptap-editor"
import {
  type TextColor,
  textColorVariants,
} from "@repo/design-system/typography/config"
import { cn } from "@repo/design-system/utils"
import type { Data } from "@repo/strapi-types"

import type { PageBuilderComponentProps } from "@repo/sections/types"

function StrapiTipTapEditorContent({
  component,
  textColor,
}: PageBuilderComponentProps & {
  component: Data.Component<"utilities.tip-tap-rich-text">
  textColor?: TextColor
}) {
  const textColorClass = textColorVariants[textColor ?? "black"]

  return (
    <Container className="tip-tap-editor-wrapper">
      <TiptapRichText
        className={cn(textColorClass)}
        content={component.content}
      />
    </Container>
  )
}

export default StrapiTipTapEditorContent
