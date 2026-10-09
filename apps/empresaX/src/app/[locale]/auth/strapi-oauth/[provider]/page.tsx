import { UseSearchParamsWrapper } from "@repo/design-system/elementary/UseSearchParamsWrapper"
import { use } from "react"

import { OAuthProvider } from "@/app/[locale]/auth/strapi-oauth/[provider]/_components/OAuthProvider"

export default function StrapiOAuthCallbackPage(
  props: PageProps<"/[locale]/auth/strapi-oauth/[provider]">
) {
  const params = use(props.params)

  return (
    <UseSearchParamsWrapper>
      <OAuthProvider params={params} />
    </UseSearchParamsWrapper>
  )
}
