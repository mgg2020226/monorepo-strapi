import type { Data } from "@repo/strapi-types"
import type { Locale } from "next-intl"

export type PageBuilderComponentProps = {
  readonly pageParams?: { locale: Locale; rest?: string[] }
  readonly page?: Data.ContentType<"api::page.page"> | null
  readonly searchParams?: Record<string, string | string[] | undefined>
}
