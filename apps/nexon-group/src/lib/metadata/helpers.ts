import { normalizePageFullPath } from "@repo/shared-data"
import type { Metadata } from "next"
import type { Locale } from "next-intl"

import { metaRobots } from "@/lib/metadata/constants"
import { routing } from "@/lib/navigation"
import type { StrapiLocalization } from "@/types/api"
import type { NextMetadataTwitterCard, SocialMetadata } from "@/types/general"

export const preprocessSocialMetadata = (
  seo: SeoMetadataInput | null | undefined,
  canonicalUrl?: string
): SocialMetadata => {
  const twitterSeo = seo?.twitter
  const ogSeo = seo?.og

  const card = ["summary", "summary_large_image", "player", "app"].includes(
    String(twitterSeo?.card)
  )
    ? (String(twitterSeo?.card) as NextMetadataTwitterCard)
    : "summary"

  const socialImage = seo?.metaImage ?? seo?.shareImage
  const ogImage = ogSeo?.image ?? socialImage
  const twitterImages =
    twitterSeo?.images ?? (socialImage ? [socialImage] : undefined)

  return {
    twitter: {
      card,
      title: twitterSeo?.title ?? seo?.metaTitle ?? undefined,
      description: twitterSeo?.description ?? seo?.metaDescription ?? undefined,
      siteId: twitterSeo?.siteId ?? undefined,
      creator: twitterSeo?.creator ?? undefined,
      creatorId: twitterSeo?.creatorId ?? undefined,
      images: twitterImages
        ?.map((img) => img?.url)
        .filter((url): url is string => Boolean(url)),
    },
    openGraph: {
      siteName: ogSeo?.siteName ?? undefined,
      title: ogSeo?.title ?? seo?.metaTitle ?? undefined,
      description: ogSeo?.description ?? seo?.metaDescription ?? undefined,
      url: ogSeo?.url ?? canonicalUrl ?? undefined,
      images: ogImage
        ? [
            {
              url: ogImage?.url ?? "",
              width: ogImage?.width ?? 0,
              height: ogImage?.height ?? 0,
              alt: ogImage?.alternativeText ?? "",
            },
          ]
        : undefined,
    },
  }
}

export const seoMergeCustomizer = (
  defaultValue: unknown,
  strapiValue: unknown
) => strapiValue ?? defaultValue

export const getMetaRobots = (
  robotsString?: string | Metadata["robots"] | null,
  forbidIndexing?: boolean
) => {
  if (forbidIndexing) {
    return { index: false, follow: false }
  }

  return typeof robotsString === "string"
    ? metaRobots[robotsString.replaceAll(" ", "")]
    : robotsString
}

export const getMetaAlternates = ({
  seo,
  fullPath,
  locale,
  localizations,
  pathPrefix,
}: {
  seo: SeoMetadataInput | null | undefined
  fullPath: string | null
  locale: Locale
  localizations?: StrapiLocalization[]
  pathPrefix?: string
}) => {
  const canonicalUrl = seo?.canonicalUrl ?? fullPath ?? ""
  let languages: Record<string, string> | undefined

  if (Array.isArray(localizations)) {
    const localizedPaths = getLocalizedPaths(localizations, pathPrefix)
    languages = Object.fromEntries(
      [...localizedPaths].map(([localizedLocale, localizedPath]) => [
        localizedLocale,
        normalizePageFullPath([localizedPath], localizedLocale),
      ])
    )

    languages[locale] = normalizePageFullPath([canonicalUrl], locale)

    const defaultLocalePath =
      locale === routing.defaultLocale
        ? canonicalUrl
        : localizedPaths.get(routing.defaultLocale)

    if (defaultLocalePath) {
      languages[routing.defaultLocale] = normalizePageFullPath(
        [defaultLocalePath],
        routing.defaultLocale
      )
    }

    // x-default should be added to point to defaultLocale version if exists
    if (defaultLocalePath) {
      languages["x-default"] = normalizePageFullPath(
        [defaultLocalePath],
        routing.defaultLocale
      )
    }
  }

  const canonical = canonicalUrl
    ? normalizePageFullPath([canonicalUrl], locale)
    : undefined

  return {
    canonical,
    languages,
  }
}

function getLocalizedPaths(
  localizations: StrapiLocalization[],
  pathPrefix?: string
) {
  const localizedPaths = new Map<Locale, string>()

  for (const localization of localizations) {
    if (!localization.locale) continue

    const localizedPath =
      localization.fullPath ??
      [pathPrefix, localization.slug].filter(Boolean).join("/")
    if (localizedPath) localizedPaths.set(localization.locale, localizedPath)
  }

  return localizedPaths
}

type SeoImage = {
  url?: string | null
  width?: number | null
  height?: number | null
  alternativeText?: string | null
}

export type SeoMetadataInput = {
  canonicalUrl?: string | null
  keywords?: string | null
  metaDescription?: string | null
  metaImage?: SeoImage | null
  metaRobots?: string | Metadata["robots"] | null
  metaTitle?: string | null
  applicationName?: string | null
  noFollow?: boolean | null
  noIndex?: boolean | null
  og?: null | {
    description?: string | null
    image?: SeoImage | null
    siteName?: string | null
    title?: string | null
    url?: string | null
  }
  shareImage?: SeoImage | null
  twitter?: null | {
    card?: string | null
    creator?: string | null
    creatorId?: string | null
    description?: string | null
    images?: SeoImage[] | null
    siteId?: string | null
    title?: string | null
  }
}
