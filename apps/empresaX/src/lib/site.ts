const DEFAULT_SITE_DOMAIN: SiteDomainMap = {
  "127.0.0.1": "empresax",
  "::1": "empresax",
  localhost: "empresax",
}

type SiteDomainMap = Record<string, string>

export function parseSiteDomainMap(value: string): SiteDomainMap {
  try {
    const parsed: unknown = JSON.parse(value)

    if (parsed == null || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("SITE_DOMAIN must be a JSON object")
    }

    const entries = Object.entries(parsed).filter(
      ([hostname, slug]) =>
        hostname.trim().length > 0 &&
        typeof slug === "string" &&
        slug.trim().length > 0
    )

    return Object.fromEntries(
      entries.map(([hostname, slug]) => [normalizeHostname(hostname), slug])
    )
  } catch (error) {
    throw new Error(
      `Invalid SITE_DOMAIN: ${error instanceof Error ? error.message : String(error)}`,
      { cause: error }
    )
  }
}

export function resolveSiteSlugFromHostname(
  hostname: string,
  domainMap?: SiteDomainMap
): string {
  const normalizedHostname = normalizeHostname(hostname)
  const configuredMap = domainMap ?? DEFAULT_SITE_DOMAIN
  const exactMatch = configuredMap[normalizedHostname]

  if (exactMatch) {
    return exactMatch
  }

  const wildcardMatch = Object.entries(configuredMap).find(
    ([configuredHostname]) =>
      configuredHostname.startsWith("*.") &&
      normalizedHostname.endsWith(configuredHostname.slice(1))
  )

  if (wildcardMatch?.[1]) {
    return wildcardMatch[1]!
  }

  throw new Error(`No site is configured for hostname '${hostname}'`)
}

export function normalizeHostname(hostname: string): string {
  const value = hostname.trim().toLowerCase()

  if (value.startsWith("[")) {
    const closingBracket = value.indexOf("]")

    return closingBracket > 0 ? value.slice(1, closingBracket) : value
  }

  const [hostnamePart] = value.split(":", 1)

  return hostnamePart ?? value
}
