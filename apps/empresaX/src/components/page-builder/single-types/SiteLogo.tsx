import type { Data } from "@repo/strapi-types"
import Image from "next/image"

import { getEnvVar } from "@/lib/env-vars"

type SiteMedia = NonNullable<Data.ContentType<"api::site.site">["logo"]>

export function SiteLogo({
  logo,
  siteName,
}: {
  readonly logo?: SiteMedia | null
  readonly siteName: string
}) {
  if (!logo?.url) {
    return null
  }

  const src = logo.url.startsWith("/")
    ? `${getEnvVar("STRAPI_URL", true)}${logo.url}`
    : logo.url

  return (
    <Image
      src={src}
      alt={logo.alternativeText ?? siteName}
      width={logo.width ?? 160}
      height={logo.height ?? 48}
      className="h-8 w-auto object-contain"
      unoptimized
    />
  )
}

SiteLogo.displayName = "SiteLogo"
