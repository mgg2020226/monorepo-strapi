import type { Core } from "@strapi/strapi"
import { errors } from "@strapi/utils"

const SITE_UID = "api::site.site"
const ASSIGNMENT_UID = "api::site-user-assignment.site-user-assignment"
const { ValidationError } = errors

type AdminUser = { id: number }
type LifecycleEvent = {
  params: {
    data?: Record<string, unknown>
    where?: Record<string, unknown>
  }
}

/** Registers tenant-aware Content Manager conditions and assignment limits. */
export async function registerSiteAccessControl({
  strapi,
}: {
  strapi: Core.Strapi
}) {
  const permissionService = strapi.service("admin::permission") as {
    conditionProvider: {
      registerMany: (conditions: Record<string, unknown>[]) => Promise<void>
    }
  }

  await permissionService.conditionProvider.registerMany([
    {
      displayName: "Assigned site records",
      name: "assigned-site-records",
      plugin: "admin",
      async handler(user: AdminUser) {
        const siteIds = await findAssignedSiteIds(strapi, user.id)

        return siteIds.length > 0 ? { "site.id": { $in: siteIds } } : false
      },
    },
    {
      displayName: "Assigned sites",
      name: "assigned-sites",
      plugin: "admin",
      async handler(user: AdminUser) {
        const siteIds = await findAssignedSiteIds(strapi, user.id)

        return siteIds.length > 0 ? { id: { $in: siteIds } } : false
      },
    },
  ])

  strapi.db.lifecycles.subscribe({
    models: [ASSIGNMENT_UID, SITE_UID],
    async beforeCreate(event) {
      if (event.model.uid === ASSIGNMENT_UID) {
        await validateAssignment(strapi, event as LifecycleEvent)
      }
    },
    async beforeUpdate(event) {
      if (event.model.uid === ASSIGNMENT_UID) {
        await validateAssignment(strapi, event as LifecycleEvent)
      }

      if (event.model.uid === SITE_UID) {
        await validateSiteCapacity(strapi, event as LifecycleEvent)
      }
    },
  })
}

async function findAssignedSiteIds(strapi: Core.Strapi, adminUserId: number) {
  const assignments = await strapi.db.query(ASSIGNMENT_UID).findMany({
    where: { adminUser: { id: adminUserId } },
    populate: { site: { select: ["id"] } },
  })

  return assignments.flatMap((assignment) =>
    typeof assignment.site?.id === "number" ? [assignment.site.id] : []
  )
}

async function validateAssignment(strapi: Core.Strapi, event: LifecycleEvent) {
  const data = event.params.data ?? {}
  const existing = await findExistingAssignment(strapi, event.params.where)
  const siteRef = getRelationReference(data.site) ?? existing?.site?.id
  const userRef =
    getRelationReference(data.adminUser) ?? existing?.adminUser?.id

  const site = await findSite(strapi, siteRef)
  const adminUserId = toNumericId(userRef)

  if (!site || !adminUserId) {
    throw new ValidationError(
      "A valid site and Strapi admin user are required."
    )
  }

  const maxUsers = site.maxUsers
  if (!Number.isSafeInteger(maxUsers) || (maxUsers as number) < 1) {
    throw new ValidationError(
      "Set a positive user limit on the site before assigning users."
    )
  }

  const currentSiteId = existing?.site?.id
  if (currentSiteId !== site.id) {
    const assignmentCount = await strapi.db.query(ASSIGNMENT_UID).count({
      where: { site: { id: site.id } },
    })
    if (assignmentCount >= (maxUsers as number)) {
      throw new ValidationError(
        "This site has reached its assigned-user limit."
      )
    }
  }

  const duplicateAssignment = await strapi.db.query(ASSIGNMENT_UID).findOne({
    where: { adminUser: { id: adminUserId }, site: { id: site.id } },
  })
  if (duplicateAssignment && duplicateAssignment.id !== existing?.id) {
    throw new ValidationError(
      "This admin user is already assigned to this site."
    )
  }
}

async function validateSiteCapacity(
  strapi: Core.Strapi,
  event: LifecycleEvent
) {
  const maxUsers = event.params.data?.maxUsers
  if (maxUsers === undefined) return

  const siteRef =
    getRelationReference(event.params.where?.id) ??
    getRelationReference(event.params.where?.documentId)
  const site = await findSite(strapi, siteRef)
  if (!site || typeof maxUsers !== "number") return

  const assignedUsers = await strapi.db.query(ASSIGNMENT_UID).count({
    where: { site: { id: site.id } },
  })
  if (maxUsers < assignedUsers) {
    throw new ValidationError(
      "The user limit cannot be lower than the current assignments."
    )
  }
}

async function findExistingAssignment(
  strapi: Core.Strapi,
  where?: Record<string, unknown>
) {
  if (!where) return null

  const existing = await strapi.db.query(ASSIGNMENT_UID).findOne({
    where,
    populate: { site: { select: ["id"] }, adminUser: { select: ["id"] } },
  })

  return existing ?? null
}

async function findSite(strapi: Core.Strapi, reference: unknown) {
  if (typeof reference !== "string" && typeof reference !== "number") {
    return null
  }

  return strapi.db.query(SITE_UID).findOne({
    where:
      typeof reference === "number"
        ? { id: reference }
        : { documentId: reference },
    select: ["id", "maxUsers"],
  })
}

function getRelationReference(value: unknown): unknown {
  let current = value
  for (let depth = 0; depth < 5; depth += 1) {
    if (typeof current === "string" || typeof current === "number") {
      return current
    }

    if (Array.isArray(current)) {
      current = current[0]
      continue
    }

    if (!current || typeof current !== "object") return undefined

    const relation = current as Record<string, unknown>
    for (const key of ["documentId", "id"]) {
      if (
        typeof relation[key] === "string" ||
        typeof relation[key] === "number"
      ) {
        return relation[key]
      }
    }

    current = relation.connect ?? relation.set
  }

  return undefined
}

function toNumericId(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isSafeInteger(value)) return value
  if (typeof value === "string" && /^\d+$/.test(value)) return Number(value)

  return undefined
}
