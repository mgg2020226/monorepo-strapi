import type React from "react"

import type {
  ElementTag,
  FontWeight,
  TextColor,
  Variant,
} from "@repo/design-system/typography/config"
import { resolveHtmlComponentClassName } from "@repo/design-system/typography/helpers"

interface ElementProps {
  readonly children: React.ReactNode
  readonly className?: string
  readonly variant?: Variant
  readonly textColor?: TextColor
  readonly fontWeight?: FontWeight
  readonly tag: ElementTag
  readonly id?: string
}

export function Element({
  children,
  className,
  variant,
  textColor = "black",
  fontWeight = "normal",
  tag: Tag,
  id,
}: ElementProps) {
  return (
    <Tag
      id={id}
      className={resolveHtmlComponentClassName({
        tag: Tag,
        variant,
        textColor,
        fontWeight,
        className,
      })}
    >
      {children}
    </Tag>
  )
}

Element.displayName = "Element"

export default Element
