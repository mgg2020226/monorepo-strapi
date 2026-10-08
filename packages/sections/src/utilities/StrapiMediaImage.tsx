import type { Data } from "@repo/strapi-types"

import { StrapiBasicImage } from "./StrapiBasicImage"

type BasicImage = Data.Component<"utilities.basic-image">

export function StrapiMediaImage({
  media,
  alt,
  className,
  fill,
  height,
  width,
}: {
  readonly media?: BasicImage["media"] | null
  readonly alt?: string | null
  readonly className?: string
  readonly fill?: boolean
  readonly height?: number
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
    />
  )
}

StrapiMediaImage.displayName = "StrapiMediaImage"
