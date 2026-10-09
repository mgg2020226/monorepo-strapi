import "server-only"

import type { Locale } from "next-intl"
import { use } from "react"

import NavbarInner from "@/components/page-builder/single-types/navbar/NavbarInner"
import { fetchSite } from "@/lib/strapi-api/content/server"

export function StrapiNavbar({ locale }: { readonly locale: Locale }) {
  const response = use(fetchSite(locale))
  const site = response?.data?.[0]

  if (site == null) {
    return null
  }

  return <NavbarInner locale={locale} siteData={site} />
}
StrapiNavbar.displayName = "StrapiNavbar"

export default StrapiNavbar
