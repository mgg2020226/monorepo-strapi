import { describe, expect, it } from "vitest"

import {
  normalizeHostname,
  parseSiteDomainMap,
  resolveSiteSlugFromHostname,
} from "./site"

describe("site domain resolution", () => {
  const domainMap = parseSiteDomainMap(
    JSON.stringify({
      "www.example.com": "main",
      "*.tenant.example.com": "tenant",
    })
  )

  it("normalizes ports and IPv6 brackets", () => {
    expect(normalizeHostname("WWW.EXAMPLE.COM:443")).toBe("www.example.com")
    expect(normalizeHostname("[::1]:3000")).toBe("::1")
  })

  it("resolves exact and wildcard hostnames", () => {
    expect(resolveSiteSlugFromHostname("www.example.com", domainMap)).toBe(
      "main"
    )
    expect(
      resolveSiteSlugFromHostname("acme.tenant.example.com", domainMap)
    ).toBe("tenant")
  })

  it("rejects unconfigured hostnames", () => {
    expect(() =>
      resolveSiteSlugFromHostname("unknown.example.com", domainMap)
    ).toThrow("No site is configured")
  })
})
