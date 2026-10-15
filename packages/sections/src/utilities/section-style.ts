import { cn } from "@repo/design-system/utils"
import type { Data } from "@repo/strapi-types"
import type { CSSProperties } from "react"

type SectionStyle = Data.Component<"ui.style"> | null | undefined

const backgrounds = {
  default: "bg-background text-foreground",
  muted: "bg-muted text-foreground",
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  dark: "bg-slate-950 text-white",
  custom: "bg-background text-foreground",
} as const

const containers = {
  none: "max-w-none",
  narrow: "max-w-4xl",
  default: "max-w-308",
  wide: "max-w-360",
  full: "max-w-none",
} as const

const padding = {
  none: "0",
  sm: "1.5rem",
  md: "2rem",
  lg: "2.5rem",
  xl: "4rem",
} as const

/** Maps the editor's constrained style fields to safe, reusable presentation props. */
export function sectionStyleProps(style: SectionStyle) {
  const background = style?.background ?? "default"
  const alignment = style?.alignment ?? "left"
  const layout = style?.layout ?? "default"
  const itemAppearance = style?.itemAppearance ?? "default"

  return {
    "data-section-background": background,
    "data-section-alignment": alignment,
    "data-section-layout": layout,
    "data-section-item-appearance": itemAppearance,
    className: backgrounds[background] ?? backgrounds.default,
    style: {
      "--section-padding-top": padding[style?.paddingTop ?? "lg"],
      "--section-padding-bottom": padding[style?.paddingBottom ?? "lg"],
    } as CSSProperties,
  }
}

export function sectionContainerClass(style: SectionStyle) {
  const container = style?.container ?? "default"

  return cn("mx-auto w-full px-6", containers[container] ?? containers.default)
}

export function sectionContentClass(style: SectionStyle, className?: string) {
  const alignment = style?.alignment ?? "left"
  const alignmentClass =
    alignment === "center"
      ? "text-center"
      : alignment === "right"
        ? "text-right"
        : "text-left"

  return cn("section-style-content", alignmentClass, className)
}
