import type { NextRequest, NextResponse } from "next/server"

/**
 * Public security headers. The app intentionally has no CMS preview
 * or draft-mode iframe flow, so frame ancestors remain disabled everywhere.
 */
export function withSecurityHeaders(
  req: NextRequest,
  res: NextResponse
): NextResponse {
  const isDevelopment = process.env.NODE_ENV === "development"
  const isLocalhost = ["localhost", "127.0.0.1", "::1"].includes(
    req.nextUrl.hostname
  )

  const localStrapiOrigin =
    isDevelopment || isLocalhost ? " http://127.0.0.1:1337" : ""

  res.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline'",
      `img-src 'self' data: blob: https:${localStrapiOrigin}`,
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-src 'self'",
      "worker-src 'self' blob:",
      `media-src 'self' blob: https:${localStrapiOrigin}`,
      "object-src 'none'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ")
  )
  res.headers.set("X-Frame-Options", "DENY")

  return res
}
