import "server-only"

import { Container } from "@repo/design-system/elementary/Container"
import { ThemeToggle } from "@repo/design-system/elementary/ThemeToggle"
import Typography from "@repo/design-system/typography"
import StrapiLink from "@repo/sections/utilities/StrapiLink"
import type { Data } from "@repo/strapi-types"

import { SiteLogo } from "@/components/page-builder/single-types/SiteLogo"
import { cn } from "@/lib/styles"

export function StrapiFooter({
  site,
}: {
  readonly site: Data.ContentType<"api::site.site"> | null
}) {
  const footer = site?.footer

  if (site == null || footer == null) {
    return null
  }

  const now = new Date()
  const currentYear = now.getFullYear()

  return (
    <div className="bg-primary/10 w-full border-t shadow-sm backdrop-blur transition-colors duration-300">
      <Container className="pt-8 pb-4">
        <div className="grid gap-10 lg:grid-cols-[minmax(14rem,1fr)_minmax(0,2fr)_auto]">
          <div className="flex flex-col items-center justify-center space-y-4 md:items-start md:justify-start">
            <SiteLogo logo={site.logo} siteName={site.name ?? ""} />
            {footer.description && (
              <Typography className="max-w-80 text-center text-sm md:text-left">
                {footer.description}
              </Typography>
            )}
          </div>

          <div
            className={cn(
              "grid min-w-0 grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            )}
          >
            {footer.columns?.map((section) => (
              <div
                className="flex flex-col items-center md:items-start"
                key={section.id}
              >
                <h3 className="footer-column-title pb-2 font-semibold">
                  {section.title}
                </h3>

                {section.links?.map((link) => (
                  <StrapiLink
                    key={link.id}
                    component={link}
                    className="text-primary w-fit text-sm hover:underline"
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="flex items-start justify-center lg:justify-end">
            <ThemeToggle className="shrink-0" />
          </div>
        </div>

        <div className="flex flex-col-reverse justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            {footer.copyright && (
              <Typography className="mx-auto w-fit lg:mx-0">
                {footer.copyright.split("{YEAR}").join(String(currentYear))}
              </Typography>
            )}
          </div>

          <div className="flex flex-col items-center sm:flex-row md:space-x-4 lg:items-end">
            {footer.legalLinks?.map((link) => (
              <StrapiLink
                key={link.id}
                component={link}
                className="w-full md:w-fit"
              />
            ))}
          </div>
        </div>
      </Container>
    </div>
  )
}

StrapiFooter.displayName = "StrapiFooter"

export default StrapiFooter
