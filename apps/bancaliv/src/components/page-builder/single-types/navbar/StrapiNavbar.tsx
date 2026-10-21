import "server-only"

import type { Data } from "@repo/strapi-types"
import type { Locale } from "next-intl"

import NavbarInner from "@/components/page-builder/single-types/navbar/NavbarInner"

export function StrapiNavbar({
  locale,
  siteData,
}: {
  readonly locale: Locale
  readonly siteData: Data.ContentType<"api::site.site"> | null
}) {
  if (siteData == null) {
    return null
  }

  return <NavbarInner locale={locale} siteData={siteData} />
}
StrapiNavbar.displayName = "StrapiNavbar"

export default StrapiNavbar
