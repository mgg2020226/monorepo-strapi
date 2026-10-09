import "server-only"

import { headers } from "next/headers"
import type { Locale } from "next-intl"
import { use } from "react"

import NavbarInner from "@/components/page-builder/single-types/navbar/NavbarInner"
import { getSessionSSR } from "@/lib/auth"
import { fetchSite } from "@/lib/strapi-api/content/server"

export function StrapiNavbar({ locale }: { readonly locale: Locale }) {
  const response = use(fetchSite(locale))
  const site = response?.data?.[0]

  if (site == null) {
    return null
  }

  const requestHeaders = use(headers())
  const session = use(getSessionSSR(requestHeaders))

  return <NavbarInner locale={locale} siteData={site} session={session} />
}
StrapiNavbar.displayName = "StrapiNavbar"

export default StrapiNavbar
