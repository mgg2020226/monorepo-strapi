import { NextResponse } from "next/server"

import { getEnvVar } from "@/lib/env-vars"
import { getSiteSlugFromHeaders } from "@/lib/site-server"
import { createStrapiAuthHeader } from "@/lib/strapi-api/request-auth"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ siteSlug: string; formSlug: string }> }
) {
  const { siteSlug, formSlug } = await params

  try {
    if (getSiteSlugFromHeaders(request.headers) !== siteSlug) {
      return NextResponse.json(
        { error: { message: "The form site does not match the request host" } },
        { status: 400 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message: error instanceof Error ? error.message : String(error),
        },
      },
      { status: 400 }
    )
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json(
      { error: { message: "Invalid JSON payload" } },
      { status: 400 }
    )
  }

  if (
    payload == null ||
    typeof payload !== "object" ||
    Array.isArray(payload)
  ) {
    return NextResponse.json(
      { error: { message: "Invalid form payload" } },
      { status: 400 }
    )
  }

  const strapiUrl = getEnvVar("STRAPI_URL", true)
  const authHeader = await createStrapiAuthHeader({
    isReadOnly: false,
  })
  const response = await fetch(
    `${strapiUrl}/api/forms/${encodeURIComponent(siteSlug)}/${encodeURIComponent(formSlug)}/submit`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...authHeader,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    }
  )

  if (!response.ok) {
    const responseBody = await response.text()

    return new NextResponse(responseBody, {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    })
  }

  const responseBody = await response.text()

  return new NextResponse(responseBody, {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  })
}
