import { strapiCacheTag } from "@repo/shared-data"
import type { MetadataRoute } from "next"
import type { Locale } from "next-intl"

import { getEnvVar } from "@/lib/env-vars"
import { isDevelopment, isProduction } from "@/lib/general-helpers"
import { createPublicFullPath, routing } from "@/lib/navigation"
import {
  fetchAllPages,
  fetchBlogPosts,
  fetchCalendarEvents,
  fetchLegalPages,
  fetchPortfolioProjects,
} from "@/lib/strapi-api/content/server"

export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isProduction() && !isDevelopment()) return []
  if (!getEnvVar("APP_PUBLIC_URL")) return []

  const results = await Promise.allSettled(
    routing.locales.map((locale) => generateLocalizedSitemap(locale))
  )

  return results
    .filter(
      (result): result is PromiseFulfilledResult<MetadataRoute.Sitemap> =>
        result.status === "fulfilled"
    )
    .flatMap((result) => result.value)
}

async function generateLocalizedSitemap(
  locale: Locale
): Promise<MetadataRoute.Sitemap> {
  const [pages, posts, events, projects, legalPages] = await Promise.all([
    fetchAllPages(
      "api::page.page",
      locale,
      { populate: { seo: true } },
      {
        next: { revalidate: 3600, tags: [strapiCacheTag("api::page.page")] },
      }
    ),
    fetchBlogPosts(locale),
    fetchCalendarEvents(locale),
    fetchPortfolioProjects(locale),
    fetchLegalPages(locale),
  ])

  const entries = [
    ...pages.data.map((page) => ({
      path: page.fullPath ?? "",
      updatedAt: page.updatedAt,
      createdAt: page.createdAt,
      seo: page.seo,
      changeFrequency: "monthly" as const,
    })),
    ...posts.data.map((post) => ({
      path: `/blog/${post.slug ?? ""}`,
      updatedAt: post.updatedAt,
      createdAt: post.createdAt,
      seo: post.seo,
      changeFrequency: "weekly" as const,
    })),
    ...events.data.map((event) => ({
      path: `/events/${event.slug ?? ""}`,
      updatedAt: event.updatedAt,
      createdAt: event.createdAt,
      seo: event.seo,
      changeFrequency: "weekly" as const,
    })),
    ...projects.data.map((project) => ({
      path: `/portfolio/${project.slug ?? ""}`,
      updatedAt: project.updatedAt,
      createdAt: project.createdAt,
      seo: project.seo,
      changeFrequency: "monthly" as const,
    })),
    ...legalPages.data.map((page) => ({
      path: `/legal/${page.slug ?? ""}`,
      updatedAt: page.updatedAt,
      createdAt: page.createdAt,
      seo: page.seo,
      changeFrequency: "yearly" as const,
    })),
  ]

  return entries
    .filter((entry) => entry.path && !isNoIndex(entry.seo))
    .map((entry) => ({
      url: createPublicFullPath(entry.path, locale),
      lastModified: entry.updatedAt ?? entry.createdAt ?? undefined,
      changeFrequency: entry.changeFrequency,
    }))
}

function isNoIndex(seo: unknown) {
  if (seo == null || typeof seo !== "object") return false
  const value = seo as { metaRobots?: string | null; noIndex?: boolean | null }

  return (
    Boolean(value.noIndex) ||
    String(value.metaRobots ?? "").startsWith("noindex")
  )
}
