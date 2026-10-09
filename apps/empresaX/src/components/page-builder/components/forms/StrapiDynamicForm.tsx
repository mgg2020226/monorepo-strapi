import "server-only"

import { Container } from "@repo/design-system/elementary/Container"
import { Typography } from "@repo/design-system/typography"
import type { DynamicFormDefinition, DynamicFormField } from "@repo/sections"
import type { Data } from "@repo/strapi-types"

import { getSiteSlugFromRequest } from "@/lib/site-server"
import { fetchFormDefinition } from "@/lib/strapi-api/content/server"
import type { PageBuilderComponentProps } from "@/types/general"

import { DynamicFormClient } from "./DynamicFormClient"

type RawFormDefinition = DynamicFormDefinition & {
  active?: boolean | null
}

export async function StrapiDynamicForm({
  component,
  pageParams,
}: PageBuilderComponentProps & {
  component: Data.Component<"forms.dynamic-form">
}) {
  const formSlug = component.formSlug?.trim()
  if (!formSlug) return null

  const locale = pageParams?.locale ?? "es"
  const response = await fetchFormDefinition(formSlug, locale)
  const form = response.data as unknown as RawFormDefinition | null

  if (!form) return null

  const definition: DynamicFormDefinition = {
    title: form.title,
    description: form.description,
    submitLabel: form.submitLabel,
    successMessage: form.successMessage,
    errorMessage: form.errorMessage,
    honeypotEnabled: form.honeypotEnabled,
    fields: normalizeFields(form.fields),
  }

  return (
    <div id={`form-section-${formSlug}`}>
      <Container className="flex flex-col gap-10 lg:gap-20">
        <div className="flex flex-1">
          <div className="mx-auto flex max-w-100 flex-col gap-4 text-center">
            <Typography tag="h3">{definition.title}</Typography>
            {definition.description && (
              <Typography>{definition.description}</Typography>
            )}
          </div>
        </div>
        <div className="mx-auto flex w-full max-w-180 flex-1">
          <DynamicFormClient
            form={definition}
            formSlug={formSlug}
            siteSlug={await getSiteSlugFromRequest()}
          />
        </div>
      </Container>
    </div>
  )
}

StrapiDynamicForm.displayName = "StrapiDynamicForm"

export default StrapiDynamicForm

function normalizeFields(fields: DynamicFormField[] | null | undefined) {
  return (fields ?? []).map((field) => ({
    ...field,
    options: field.options ?? [],
  }))
}
