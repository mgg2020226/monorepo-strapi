import type { UID } from "@repo/strapi-types"
import { mergeWith } from "lodash"
import type { Metadata } from "next"
import { draftMode } from "next/headers"
import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { getEnvVar } from "@/lib/env-vars"
import { isProduction } from "@/lib/general-helpers"
import { logger } from "@/lib/logging"
import {
  getDefaultMetadata,
  getDefaultOgMeta,
  getDefaultTwitterMeta,
} from "@/lib/metadata/defaults"
import {
  getMetaAlternates,
  getMetaRobots,
  preprocessSocialMetadata,
  type SeoMetadataInput,
  seoMergeCustomizer,
} from "@/lib/metadata/helpers"
import { fetchSeo, fetchSeoBySlug } from "@/lib/strapi-api/content/server"
import type { StrapiLocalization } from "@/types/api"
import type { SocialMetadata } from "@/types/general"

export async function getMetadataFromStrapi({
  fullPath,
  slug,
  pathPrefix,
  locale,
  customMetadata,
  uid = "api::page.page",
}: {
  fullPath?: string
  slug?: string
  pathPrefix?: string
  locale: Locale
  customMetadata?: Metadata
  uid?: Extract<
    UID.ContentType,
    | "api::page.page"
    | "api::blog-post.blog-post"
    | "api::calendar-event.calendar-event"
    | "api::portfolio-project.portfolio-project"
    | "api::legal-page.legal-page"
  >
}): Promise<Metadata | null> {
  const t = await getTranslations({ locale, namespace: "seo" })
  const siteUrl = getEnvVar("APP_PUBLIC_URL")
  if (!siteUrl) {
    logger.warn("APP_PUBLIC_URL is not defined, cannot generate metadata")

    return null
  }

  const defaultMeta: Metadata = getDefaultMetadata(siteUrl, t)
  const defaultOgMeta: Metadata["openGraph"] = getDefaultOgMeta(
    locale,
    fullPath,
    t
  )
  const defaultTwitterMeta: Metadata["twitter"] = getDefaultTwitterMeta(t)

  // skip strapi fetching and return SEO from translations
  if (!fullPath && !slug) {
    return {
      ...defaultMeta,
      openGraph: defaultOgMeta,
      twitter: defaultTwitterMeta,
    }
  }

  try {
    return await fetchAndMapStrapiMetadata(
      locale,
      fullPath ?? null,
      slug,
      pathPrefix,
      defaultMeta,
      defaultOgMeta,
      defaultTwitterMeta,
      customMetadata,
      uid
    )
  } catch (e: unknown) {
    logger.warn("SEO metadata could not be fetched", {
      uid,
      fullPath,
      error: (e as Error)?.message,
    })

    return {
      ...defaultMeta,
      openGraph: defaultOgMeta,
      twitter: defaultTwitterMeta,
    }
  }
}

async function fetchAndMapStrapiMetadata(
  locale: Locale,
  fullPath: string | null,
  slug: string | undefined,
  pathPrefix: string | undefined,
  defaultMeta: Metadata,
  defaultOgMeta: Metadata["openGraph"],
  defaultTwitterMeta: Metadata["twitter"],
  customMetadata?: Metadata,
  uid: Extract<
    UID.ContentType,
    | "api::page.page"
    | "api::blog-post.blog-post"
    | "api::calendar-event.calendar-event"
    | "api::portfolio-project.portfolio-project"
    | "api::legal-page.legal-page"
  > = "api::page.page"
) {
  const forbidIndexing = !isProduction() || (await draftMode()).isEnabled
  const res = slug
    ? await fetchSeoBySlug(uid, slug, locale)
    : await fetchSeo(uid as "api::page.page", fullPath, locale)

  const seo = res?.data?.seo as SeoMetadataInput | null | undefined
  const localizations = res?.data?.localizations as
    | StrapiLocalization[]
    | undefined

  const strapiMeta: Metadata = {
    title: seo?.metaTitle,
    description: seo?.metaDescription,
    keywords: seo?.keywords,
    applicationName: seo?.applicationName,
  }

  const robots = forbidIndexing
    ? getMetaRobots(undefined, true)
    : seo?.noIndex || seo?.noFollow
      ? { index: !seo.noIndex, follow: !seo.noFollow }
      : getMetaRobots(seo?.metaRobots)
  const entityPath = slug ? `${pathPrefix ?? ""}/${slug}` : fullPath
  const alternates = getMetaAlternates({
    seo,
    fullPath: entityPath,
    locale,
    localizations,
    pathPrefix,
  })
  const strapiSocialMeta: SocialMetadata = preprocessSocialMetadata(
    seo,
    alternates?.canonical
  )

  return {
    ...mergeWith(defaultMeta, strapiMeta, seoMergeCustomizer),
    openGraph: mergeWith(
      defaultOgMeta,
      strapiSocialMeta.openGraph,
      seoMergeCustomizer
    ),
    twitter: mergeWith(
      defaultTwitterMeta,
      strapiSocialMeta.twitter,
      seoMergeCustomizer
    ),
    robots,
    alternates,
    ...customMetadata,
  }
}
