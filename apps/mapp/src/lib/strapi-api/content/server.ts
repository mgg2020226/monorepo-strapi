import "server-only"

import { strapiCacheTag } from "@repo/shared-data"
import type { UID } from "@repo/strapi-types"
import { draftMode } from "next/headers"
import type { Locale } from "next-intl"

import { logNonBlockingError } from "@/lib/logging"
import { getSiteSlugFromRequest } from "@/lib/site-server"
import { PublicStrapiClient } from "@/lib/strapi-api"
import type { CustomFetchOptions } from "@/types/general"

async function getContentStatus() {
  return (await draftMode()).isEnabled ? "draft" : "published"
}

async function getPublishedContentStatusFilter() {
  return (await draftMode()).isEnabled ? undefined : "published"
}

// ------ Page fetching functions
export async function fetchPage(
  fullPath: string,
  locale: Locale,
  requestInit?: RequestInit,
  options?: CustomFetchOptions
) {
  try {
    return await PublicStrapiClient.fetchOneByFullPath(
      "api::page.page",
      fullPath,
      {
        locale,
        status: await getContentStatus(),
        filters: { site: { slug: await getSiteSlugFromRequest() } },
        populate: { seo: "smart", content: "smart" },
      },
      {
        ...requestInit,
        next: {
          ...requestInit?.next,
          revalidate: requestInit?.next?.revalidate ?? 120,
        },
      },
      options
    )
  } catch (e: unknown) {
    logNonBlockingError({
      message: `Error fetching page '${fullPath}' for locale '${locale}'`,
      error: {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      },
    })
  }
}

export async function fetchAllPages(
  uid: Extract<UID.ContentType, "api::page.page"> = "api::page.page",
  locale?: Locale,
  params?: Record<string, unknown>,
  requestInit?: RequestInit
) {
  try {
    return await PublicStrapiClient.fetchAll(
      uid,
      {
        locale,
        fields: ["fullPath", "locale", "updatedAt", "createdAt", "slug"],
        populate: {},
        status: await getContentStatus(),
        filters: { site: { slug: await getSiteSlugFromRequest() } },
        ...params,
      },
      requestInit
    )
  } catch (e: unknown) {
    logNonBlockingError({
      message: `Error fetching all pages for locale '${locale}'`,
      error: {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      },
    })

    return { data: [] }
  }
}

// ------ SEO fetching functions

export async function fetchSeo(
  // eslint-disable-next-line @typescript-eslint/default-param-last
  uid: Extract<UID.ContentType, "api::page.page"> = "api::page.page",
  fullPath: string | null,
  locale: Locale
) {
  try {
    return await PublicStrapiClient.fetchOneByFullPath(uid, fullPath, {
      locale,
      filters: { site: { slug: await getSiteSlugFromRequest() } },
      populate: {
        seo: "smart",
        localizations: true,
      },
    })
  } catch (e: unknown) {
    logNonBlockingError({
      message: `Error fetching SEO for '${uid}' with fullPath '${fullPath}' for locale '${locale}'`,
      error: {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      },
    })
  }
}

// ------ Site chrome fetching functions

export async function fetchSite(locale: Locale) {
  try {
    return await PublicStrapiClient.fetchAll(
      "api::site.site",
      {
        locale,
        filters: {
          slug: await getSiteSlugFromRequest(),
          status: "active",
        },
        populate: {
          logo: true,
          header: "smart",
          footer: "smart",
          socialLinks: "smart",
        },
      },
      {
        next: {
          revalidate: 600,
          tags: [strapiCacheTag("api::site.site")],
        },
      }
    )
  } catch (e: unknown) {
    logNonBlockingError({
      message: `Error fetching site chrome for locale '${locale}'`,
      error: {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      },
    })
  }
}

type SiteScopedContentUid =
  | "api::page.page"
  | "api::blog-post.blog-post"
  | "api::calendar-event.calendar-event"
  | "api::portfolio-project.portfolio-project"
  | "api::legal-page.legal-page"

export async function fetchBlogPosts(locale: Locale) {
  const contentStatus = await getPublishedContentStatusFilter()

  return PublicStrapiClient.fetchAll("api::blog-post.blog-post", {
    locale,
    status: await getContentStatus(),
    filters: {
      site: { slug: await getSiteSlugFromRequest() },
      ...(contentStatus && { contentStatus }),
    },
    populate: {
      seo: "smart",
      coverImage: "smart",
      category: "smart",
      tags: "smart",
    },
    sort: { publishedAt: "desc" },
  })
}

export async function fetchBlogPost(slug: string, locale: Locale) {
  const contentStatus = await getPublishedContentStatusFilter()

  return PublicStrapiClient.fetchOneBySlug("api::blog-post.blog-post", slug, {
    locale,
    status: await getContentStatus(),
    filters: {
      site: { slug: await getSiteSlugFromRequest() },
      ...(contentStatus && { contentStatus }),
    },
    populate: {
      seo: "smart",
      coverImage: "smart",
      category: "smart",
      tags: "smart",
      localizations: true,
    },
  })
}

export async function fetchCalendarEvents(locale: Locale) {
  const contentStatus = await getPublishedContentStatusFilter()

  return PublicStrapiClient.fetchAll("api::calendar-event.calendar-event", {
    locale,
    status: await getContentStatus(),
    filters: {
      site: { slug: await getSiteSlugFromRequest() },
      ...(contentStatus && { contentStatus }),
    },
    populate: { seo: "smart", image: "smart" },
    sort: { startDate: "asc", startTime: "asc" },
  })
}

export async function fetchCalendarEvent(slug: string, locale: Locale) {
  const contentStatus = await getPublishedContentStatusFilter()

  return PublicStrapiClient.fetchOneBySlug(
    "api::calendar-event.calendar-event",
    slug,
    {
      locale,
      status: await getContentStatus(),
      filters: {
        site: { slug: await getSiteSlugFromRequest() },
        ...(contentStatus && { contentStatus }),
      },
      populate: { seo: "smart", image: "smart", localizations: true },
    }
  )
}

export async function fetchPortfolioProjects(locale: Locale) {
  return PublicStrapiClient.fetchAll(
    "api::portfolio-project.portfolio-project",
    {
      locale,
      status: await getContentStatus(),
      filters: { site: { slug: await getSiteSlugFromRequest() } },
      populate: { seo: "smart", coverImage: "smart", gallery: "smart" },
      sort: { order: "asc", title: "asc" },
    }
  )
}

export async function fetchPortfolioProject(slug: string, locale: Locale) {
  return PublicStrapiClient.fetchOneBySlug(
    "api::portfolio-project.portfolio-project",
    slug,
    {
      locale,
      status: await getContentStatus(),
      filters: { site: { slug: await getSiteSlugFromRequest() } },
      populate: {
        seo: "smart",
        coverImage: "smart",
        gallery: "smart",
        localizations: true,
      },
    }
  )
}

export async function fetchLegalPages(locale: Locale) {
  const contentStatus = await getPublishedContentStatusFilter()

  return PublicStrapiClient.fetchAll("api::legal-page.legal-page", {
    locale,
    status: await getContentStatus(),
    filters: {
      site: { slug: await getSiteSlugFromRequest() },
      ...(contentStatus && { contentStatus }),
    },
    populate: { seo: "smart" },
    sort: { legalType: "asc", title: "asc" },
  })
}

export async function fetchLegalPage(slug: string, locale: Locale) {
  const contentStatus = await getPublishedContentStatusFilter()

  return PublicStrapiClient.fetchOneBySlug("api::legal-page.legal-page", slug, {
    locale,
    status: await getContentStatus(),
    filters: {
      site: { slug: await getSiteSlugFromRequest() },
      ...(contentStatus && { contentStatus }),
    },
    populate: { seo: "smart", localizations: true },
  })
}

export async function fetchSeoBySlug(
  uid: SiteScopedContentUid,
  slug: string,
  locale: Locale
) {
  return PublicStrapiClient.fetchOneBySlug(uid, slug, {
    locale,
    status: await getContentStatus(),
    filters: { site: { slug: await getSiteSlugFromRequest() } },
    populate: { seo: "smart", localizations: true },
  })
}

// ------ Redirect fetching functions

export async function fetchRedirects() {
  try {
    // fetchAll paginates through every page — a redirect list capped at one
    // page would silently drop redirects beyond the page size (easy to hit
    // after a site migration).
    const response = await PublicStrapiClient.fetchAll(
      "api::redirect.redirect",
      {
        status: await getContentStatus(),
        filters: { site: { slug: await getSiteSlugFromRequest() } },
      },
      {
        // Redirects are cached in-process by `src/lib/redirects.ts`. Avoid
        // stacking Next's Data Cache underneath it, because proxy refreshes
        // should decide freshness from the local stale-while-refresh cache.
        cache: "no-store",
      }
    )

    return response.data
  } catch (e: unknown) {
    logNonBlockingError({
      message: "Error fetching redirects",
      error: {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      },
    })

    // Rethrow instead of returning [] — the redirect cache must distinguish
    // "no redirects exist" from "Strapi unreachable". An empty list here would
    // be cached and wipe the last known good redirects for a full TTL.
    throw e instanceof Error ? e : new Error(String(e))
  }
}
