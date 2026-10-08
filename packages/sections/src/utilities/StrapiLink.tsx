import AppLink from "@repo/design-system/elementary/AppLink"
import type { Data } from "@repo/strapi-types"
import type React from "react"

import { StrapiBasicImage } from "@repo/sections/utilities/StrapiBasicImage"

export interface StrapiLinkProps {
  readonly component:
    | Data.Component<"utilities.link">
    | Data.Component<"ui.link">
    | Data.Component<"site.navigation-item">
    | undefined
    | null
  readonly children?: React.ReactNode
  readonly className?: string
  readonly onClick?: () => void
}
type LinkComponent = NonNullable<StrapiLinkProps["component"]>

const getStrapiLinkHref = (component?: LinkComponent | null) => {
  if (component && "href" in component) {
    return component.href
  }

  // Add more when needed
  if (!component || !("type" in component)) {
    return
  }

  switch (component.type) {
    case "external":
      return component.href
    case "page":
      return component.page?.fullPath ?? "#"

    default:
      return
  }
}

export function StrapiLink({
  component,
  children,
  className,
  onClick,
}: StrapiLinkProps) {
  if (component == null) {
    return null
  }

  const { label } = component
  const newTab =
    "newTab" in component
      ? component.newTab
      : "target" in component
        ? component.target === "_blank"
        : false

  const isUiLink = "variant" in component
  const variant = isUiLink
    ? component.variant === "default"
      ? "default"
      : component.variant
    : "link"
  const size = isUiLink
    ? component.size === "sm"
      ? "sm"
      : component.size === "lg"
        ? "lg"
        : "default"
    : "default"
  const decorations = "decorations" in component ? component.decorations : null
  const leftIcon = decorations?.leftIcon
  const rightIcon = decorations?.rightIcon
  const hasIcons = decorations?.hasIcons ?? false
  const disableAnimations = decorations?.disableAnimations ?? false

  const linkHref = getStrapiLinkHref(component)

  if (!linkHref) {
    return children ?? label ?? null
  }

  return (
    <AppLink
      href={linkHref}
      openInNewTab={newTab ?? false}
      disableAnimations={disableAnimations ?? false}
      className={className}
      onClick={onClick}
      startAdornment={
        hasIcons && leftIcon ? (
          <StrapiBasicImage
            component={leftIcon}
            fill
            className="size-full object-contain"
          />
        ) : undefined
      }
      endAdornment={
        hasIcons && rightIcon ? (
          <StrapiBasicImage
            component={rightIcon}
            fill
            className="size-full object-contain"
          />
        ) : undefined
      }
      variant={variant}
      size={size}
    >
      {children ?? label}
    </AppLink>
  )
}

StrapiLink.displayName = "StrapiLink"

export default StrapiLink
