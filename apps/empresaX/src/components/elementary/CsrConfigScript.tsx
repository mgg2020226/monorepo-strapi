"use client"

import { useServerInsertedHTML } from "next/navigation"

type CsrConfigScriptProps = {
  readonly content: string
}

export function CsrConfigScript({ content }: CsrConfigScriptProps) {
  useServerInsertedHTML(() => (
    <script id="csr-config" dangerouslySetInnerHTML={{ __html: content }} />
  ))

  return null
}
