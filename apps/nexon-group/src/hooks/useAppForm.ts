"use client"

import type { DynamicFormValues } from "@repo/sections"
import { useCallback, useState } from "react"

type MutationOptions<TResult> = {
  onSuccess?: (data: TResult) => void
}

function useFormSubmission<TValues, TResult>(
  submit: (values: TValues) => Promise<TResult>
) {
  const [error, setError] = useState<Error | null>(null)

  const mutateAsync = useCallback(
    async (values: TValues) => {
      setError(null)

      try {
        return await submit(values)
      } catch (cause) {
        const submissionError =
          cause instanceof Error ? cause : new Error(String(cause))
        setError(submissionError)
        throw submissionError
      }
    },
    [submit]
  )

  const mutate = useCallback(
    async (values: TValues, options?: MutationOptions<TResult>) => {
      try {
        const data = await mutateAsync(values)
        options?.onSuccess?.(data)
      } catch {
        // The error is exposed through the returned mutation state.
      }
    },
    [mutateAsync]
  )

  return { error, mutate, mutateAsync }
}

export function useContactForm(siteSlug: string, formSlug = "contact") {
  const submit = useCallback(
    async (values: { name: string; email: string; message: string }) => {
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
    [siteSlug, formSlug]
  )

  return useFormSubmission(submit)
}

export function useDynamicForm(siteSlug: string, formSlug: string) {
  const submit = useCallback(
    async (values: DynamicFormValues) => {
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
    [siteSlug, formSlug]
  )

  return useFormSubmission(submit)
}
