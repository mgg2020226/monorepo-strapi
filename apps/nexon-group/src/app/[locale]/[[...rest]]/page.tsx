import { ROOT_PAGE_PATH } from "@repo/shared-data"
import { notFound } from "next/navigation"
import { use } from "react"

import StrapiPageView from "@/components/layouts/StrapiPageView"
import { getMetadataFromStrapi } from "@/lib/metadata"
import { isValidLocale } from "@/lib/navigation"

// The host selects the site and the navbar reads the request session, so this
// route must be rendered per request. This keeps domain resolution and auth
// correct instead of silently caching one site's content for every host.
export const dynamic = "force-dynamic"

export async function generateMetadata(
  props: PageProps<"/[locale]/[[...rest]]">
) {
  const params = await props.params
  const locale = params.locale
  if (!isValidLocale(locale)) {
    return null
  }

  const fullPath = ROOT_PAGE_PATH + (params.rest ?? []).join("/")

  return getMetadataFromStrapi({ fullPath, locale })
}

export default function StaticStrapiPage(
  props: PageProps<"/[locale]/[[...rest]]">
) {
  const params = use(props.params)
  if (!isValidLocale(params.locale)) {
    notFound()
  }

  return <StrapiPageView params={params} />
}
