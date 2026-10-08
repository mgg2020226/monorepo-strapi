import {
  type FontWeight,
  type ElementTag,
  type TypographyTag,
  type TextColor,
  type Variant,
  defaultStyles,
  fontWeightVariants,
  textColorVariants,
  variantStyles,
} from "@repo/design-system/typography/config"
import { cn } from "@repo/design-system/utils"

type HtmlClassNameParams = {
  tag: ElementTag | TypographyTag
  variant?: Variant
  textColor: TextColor
  fontWeight: FontWeight
  className?: string
}

export function resolveHtmlComponentClassName({
  tag,
  variant,
  textColor,
  fontWeight,
  className,
}: HtmlClassNameParams) {
  const selectedVariant = variant
    ? variantStyles[variant]
    : variantStyles[defaultStyles[tag]]

  return cn(
    selectedVariant,
    textColorVariants[textColor],
    fontWeightVariants[fontWeight],
    className
  )
}
