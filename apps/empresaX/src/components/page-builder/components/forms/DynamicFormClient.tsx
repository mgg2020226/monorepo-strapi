"use client"

import { DynamicForm, type DynamicFormDefinition } from "@repo/sections"

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
