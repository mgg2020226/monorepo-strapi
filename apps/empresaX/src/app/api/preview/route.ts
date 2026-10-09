import { draftMode } from "next/headers"
import { NextResponse } from "next/server"

import { getEnvVar } from "@/lib/env-vars"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const secret = url.searchParams.get("secret")
  const target = url.searchParams.get("url") ?? "/"
  const status = url.searchParams.get("status") ?? "draft"
  const configuredSecret = getEnvVar("STRAPI_PREVIEW_SECRET")

  if (!configuredSecret || secret !== configuredSecret) {
    return NextResponse.json(
      { error: "Invalid preview secret" },
      { status: 401 }
    )
  }

  const destination = new URL(target, url.origin)
  if (destination.origin !== url.origin) {
    return NextResponse.json({ error: "Invalid preview URL" }, { status: 400 })
  }

  const draft = await draftMode()
  if (status === "draft") draft.enable()
  else if (status === "published") draft.disable()
  else
    return NextResponse.json(
      { error: "Invalid preview status" },
      { status: 400 }
    )

  return NextResponse.redirect(destination)
}
