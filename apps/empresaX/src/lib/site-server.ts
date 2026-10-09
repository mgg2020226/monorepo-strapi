import { headers } from "next/headers"

import { getEnvVar } from "@/lib/env-vars"
import { parseSiteDomainMap, resolveSiteSlugFromHostname } from "@/lib/site"

export async function getSiteSlugFromRequest(): Promise<string> {
  const requestHeaders = await headers()

  return getSiteSlugFromHeaders(requestHeaders)
}

export function getSiteSlugFromHeaders(requestHeaders: Headers): string {
  const hostname =
    requestHeaders.get("host") ?? requestHeaders.get("x-forwarded-host")

  if (!hostname) {
    throw new Error("Cannot resolve the site without a request hostname")
  }

  return resolveSiteSlugFromHostname(
    hostname,
    parseSiteDomainMap(getEnvVar("SITE_DOMAIN", true)!)
  )
}
