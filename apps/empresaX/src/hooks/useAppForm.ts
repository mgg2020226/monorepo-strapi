"use client"

import type { DynamicFormValues } from "@repo/sections"
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

export function useDynamicForm(siteSlug: string, formSlug: string) {
  return useMutation({
    mutationFn: async (values: DynamicFormValues) => {
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
        throw new Error(body?.error?.message ?? "Form submission failed")
      }

      return body
    },
  })
}
