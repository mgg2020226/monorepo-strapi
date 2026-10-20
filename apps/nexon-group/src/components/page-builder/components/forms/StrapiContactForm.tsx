import "server-only"

import { Container } from "@repo/design-system/elementary/Container"
import { Typography } from "@repo/design-system/typography"
import type { Data } from "@repo/strapi-types"

import { ContactForm } from "@/components/elementary/forms/ContactForm"
import { getSiteSlugFromRequest } from "@/lib/site-server"
import type { PageBuilderComponentProps } from "@/types/general"

export async function StrapiContactForm({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"forms.contact-form">
}) {
  const siteSlug = await getSiteSlugFromRequest()

  return (
    <div id="form-section">
      <Container className="flex flex-col gap-10 lg:gap-20">
        <div className="flex flex-1">
          <div className="mx-auto flex max-w-100 flex-col gap-10 text-center">
            {component.title && (
              <Typography tag="h3">{component.title}</Typography>
            )}
            {component.description && (
              <Typography>{component.description}</Typography>
            )}
          </div>
        </div>
        <div className="mx-auto flex w-full max-w-180 flex-1">
          <ContactForm
            siteSlug={siteSlug}
            gdpr={{
              href: component.gdpr?.href ?? undefined,
              label: component.gdpr?.label ?? undefined,
              newTab: component.gdpr?.newTab ?? false,
            }}
          />
        </div>
      </Container>
    </div>
  )
}

StrapiContactForm.displayName = "StrapiContactForm"

export default StrapiContactForm
