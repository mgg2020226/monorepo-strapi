import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // List of paths that should not be treated as manager slugs
  const excludedPaths = [
    "/favicon.ico",
    "/robots.txt",
    "/sitemap.xml",
    "/_next",
    "/api",
  ];

  // Check if the pathname starts with any excluded path
  const isExcluded = excludedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (isExcluded) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
