"use client"

import { useMutation } from "@tanstack/react-query"

export function useContactForm(siteSlug: string, formSlug = "contact") {
  return useMutation({
    mutationFn: async (values: {
      name: string
      email: string
      message: string
    }) => {
      const response = await fetch(
        `/api/forms/${encodeURIComponent(siteSlug)}/${encodeURIComponent(formSlug)}/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      )

      const body = await response.json()
      if (!response.ok) {
        throw new Error(
          body?.error?.message ?? "Contact form submission failed"
        )
      }

      return body
    },
  })
}
