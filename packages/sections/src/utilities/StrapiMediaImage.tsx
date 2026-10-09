import type { Data } from "@repo/strapi-types"
import type { ImageProps } from "next/image"

import { StrapiBasicImage } from "./StrapiBasicImage"

type BasicImage = Data.Component<"utilities.basic-image">

export function StrapiMediaImage({
  media,
  alt,
  className,
  fill,
  height,
  loading,
  priority,
  sizes,
  width,
}: {
  readonly media?: BasicImage["media"] | null
  readonly alt?: string | null
  readonly className?: string
  readonly fill?: boolean
  readonly height?: number
  readonly loading?: ImageProps["loading"]
  readonly priority?: ImageProps["priority"]
  readonly sizes?: ImageProps["sizes"]
  readonly width?: number
}) {
  if (!media) return null

  return (
    <StrapiBasicImage
      component={{ id: 0, media, alt } as BasicImage}
      className={className}
      fill={fill}
      height={height}
      width={width}
      loading={loading}
      priority={priority}
      sizes={sizes}
    />
  )
}

StrapiMediaImage.displayName = "StrapiMediaImage"
