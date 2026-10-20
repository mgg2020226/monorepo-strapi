"use client"

import { DynamicForm } from "@repo/sections/forms/DynamicForm"
import type { DynamicFormDefinition } from "@repo/sections/forms/types"

import { useDynamicForm } from "@/hooks/useAppForm"

export function DynamicFormClient({
  form,
  formSlug,
  siteSlug,
}: {
  form: DynamicFormDefinition
  formSlug: string
  siteSlug: string
}) {
  const mutation = useDynamicForm(siteSlug, formSlug)

  return (
    <DynamicForm
      form={form}
      onSubmit={(values) => mutation.mutateAsync(values)}
    />
  )
}
