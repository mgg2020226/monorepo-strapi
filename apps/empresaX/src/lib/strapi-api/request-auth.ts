import { getEnvVar } from "@/lib/env-vars"

const ALLOWED_STRAPI_ENDPOINTS: Record<string, string[]> = {
  GET: ["api/pages", "api/footer", "api/navbar"],
}

/**
 * Check if the given Strapi Admin/API path is allowed to be accessed
 * with the provided HTTP method.
 */
export const isStrapiEndpointAllowed = (
  path: string,
  method: string
): boolean => {
  return (
    ALLOWED_STRAPI_ENDPOINTS[method]?.some((endpoint) =>
      path.startsWith(endpoint)
    ) ?? false
  )
}

/**
 * Create a Strapi authorization header using the appropriate API token.
 * Read-only requests use the restricted token when it is configured.
 */
export const createStrapiAuthHeader = ({
  isReadOnly,
}: {
  isReadOnly?: boolean
}) => {
  const apiToken = getEnvVar(
    isReadOnly ? "STRAPI_REST_READONLY_API_KEY" : "STRAPI_REST_CUSTOM_API_KEY"
  )

  return formatStrapiAuthorizationHeader(apiToken)
}

export const formatStrapiAuthorizationHeader = (token?: string) => {
  if (!token) {
    return {} as Record<string, string>
  }

  return {
    Authorization: `Bearer ${token}`,
  }
}
