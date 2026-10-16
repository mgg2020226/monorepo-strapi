import { normalizePageFullPath } from "@repo/shared-data"
import type { Core } from "@strapi/strapi"

import { logError } from "../utils/logging"

const PAGE_BATCH_SIZE = 500

type PageNode = {
  documentId: string
  locale: string
  slug: string
  fullPath: string | null
  parentDocumentId: string | null
}

type PagePathChange = {
  documentId: string
  locale: string
  oldFullPath: string | null
  newFullPath: string
}

/**
 * Keeps published page paths in sync with their current parent and slug.
 * Old paths are revalidated but are not redirected.
 */
export const registerPageFullPathSyncMiddleware = ({
  strapi,
}: {
  strapi: Core.Strapi
}) => {
  strapi.documents.use(async (context, next) => {
    const result = await next()
    const params = toRecord(context.params) ?? {}
    const data = toRecord(params.data)

    if (
      context.uid === "api::page.page" &&
      data?.updatedBy !== null &&
      shouldSyncPagePaths(context.action, params)
    ) {
      try {
        await syncPublishedPagePaths(strapi)
      } catch (error) {
        logError(error, "Automatic page path synchronization failed")
      }
    }

    return result
  })
}

async function syncPublishedPagePaths(strapi: Core.Strapi) {
  const locales: { code: string }[] = await strapi
    .plugin("i18n")
    .service("locales")
    .find()

  for (const { code: locale } of locales) {
    const pages = await listPublishedPages(strapi, locale)
    const changes = computePagePathChanges(pages)

    for (const change of changes) {
      await strapi.documents("api::page.page").update({
        documentId: change.documentId,
        locale: change.locale,
        status: "published",
        data: {
          fullPath: change.newFullPath,
          // This marker prevents this internal write from recursively syncing.
          updatedBy: null,
        },
      })
    }

    if (changes.length > 0) {
      try {
        await strapi.service("api::revalidate.revalidate").run({
          uid: "api::page.page",
          locale,
          fullPaths: changes.flatMap(({ oldFullPath, newFullPath }) =>
            oldFullPath ? [oldFullPath, newFullPath] : [newFullPath]
          ),
        })
      } catch (error) {
        logError(
          error,
          "Page paths were updated but cache revalidation failed",
          {
            locale,
          }
        )
      }
    }
  }
}

async function listPublishedPages(strapi: Core.Strapi, locale: string) {
  const pages: PageNode[] = []
  let start = 0

  while (true) {
    const batch = await strapi.documents("api::page.page").findMany({
      status: "published",
      locale,
      fields: ["slug", "fullPath"],
      populate: { parent: { fields: ["documentId"] } },
      start,
      limit: PAGE_BATCH_SIZE,
    })

    pages.push(
      ...batch.map((page) => ({
        documentId: page.documentId,
        locale,
        slug: page.slug,
        fullPath: page.fullPath ?? null,
        parentDocumentId: page.parent?.documentId ?? null,
      }))
    )

    if (batch.length < PAGE_BATCH_SIZE) break
    start += PAGE_BATCH_SIZE
  }

  return pages
}

function computePagePathChanges(pages: PageNode[]): PagePathChange[] {
  const pagesById = new Map(pages.map((page) => [page.documentId, page]))
  const expectedFullPaths = new Map<string, string>()

  const getExpectedFullPath = (
    page: PageNode,
    visited: Set<string>
  ): string => {
    const cached = expectedFullPaths.get(page.documentId)
    if (cached != null) return cached

    const parent = page.parentDocumentId
      ? pagesById.get(page.parentDocumentId)
      : undefined

    const parentPath =
      parent && !visited.has(parent.documentId)
        ? getExpectedFullPath(parent, new Set([...visited, parent.documentId]))
        : undefined
    const fullPath = normalizePageFullPath(
      parentPath ? [parentPath, page.slug] : [page.slug]
    )

    expectedFullPaths.set(page.documentId, fullPath)

    return fullPath
  }

  return pages.flatMap((page) => {
    const newFullPath = getExpectedFullPath(page, new Set([page.documentId]))
    if (newFullPath === page.fullPath) return []

    return [
      {
        documentId: page.documentId,
        locale: page.locale,
        oldFullPath: page.fullPath,
        newFullPath,
      },
    ]
  })
}

function shouldSyncPagePaths(
  action: string | undefined,
  params: Record<string, unknown>
) {
  if (["publish", "unpublish", "delete"].includes(action ?? "")) {
    return true
  }

  return (
    ["create", "update"].includes(action ?? "") && params.status === "published"
  )
}

function toRecord(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== "object") return undefined

  return value as Record<string, unknown>
}
