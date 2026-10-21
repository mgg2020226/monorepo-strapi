import "server-only"

import { Container } from "@repo/design-system/elementary/Container"
import type { Data } from "@repo/strapi-types"

import { fetchFormDefinition } from "@/lib/strapi-api/content/server"
import type { PageBuilderComponentProps } from "@/types/general"

import StrapiContactForm from "./StrapiContactForm"

export default async function StrapiBancalivContactForm({
  component,
  pageParams,
}: PageBuilderComponentProps & {
  component: Data.Component<"forms.contact-form">
}) {
  const response = await fetchFormDefinition(
    "contact",
    pageParams?.locale ?? "es"
  )
  const definition = response.data as null | { recipientEmail?: string | null }

  if (!definition?.recipientEmail?.trim()) {
    return (
      <Container>
        <p
          role="status"
          className="mx-auto max-w-3xl rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950"
        >
          {pageParams?.locale === "en"
            ? "This form is inactive because its email recipient is missing from Strapi."
            : "El formulario está inactivo porque falta configurar su destinatario de correo en Strapi."}
        </p>
      </Container>
    )
  }

  return <StrapiContactForm component={component} pageParams={pageParams} />
}
