import "server-only"

import { Container } from "@repo/design-system/elementary/Container"
import StrapiLink from "@repo/sections/utilities/StrapiLink"
import type { Data } from "@repo/strapi-types"
import type { Locale } from "next-intl"

import LocaleSwitcher from "@/components/elementary/LocaleSwitcher"
import {
  NavbarMobileNavigation,
  NavbarMobileProvider,
  NavbarMobileToggle,
} from "@/components/page-builder/single-types/navbar/NavbarMobileControls"
import { SiteLogo } from "@/components/page-builder/single-types/SiteLogo"

import { DesktopNavigation } from "./DesktopNavigation"

export function NavbarInner({
  locale,
  siteData,
}: {
  readonly locale: Locale
  readonly siteData?: Data.ContentType<"api::site.site"> | null
}) {
  return (
    <NavbarMobileProvider>
      <header className="bg-background/60 sticky top-0 z-50 h-16 w-full border-b shadow-sm backdrop-blur-md transition-colors duration-300">
        <div className="flex h-16 items-center">
          <Container className="flex h-full items-center justify-between px-6">
            {/* LEFT SIDE */}
            <div className="flex items-center gap-2">
              {/* Logo */}
              <SiteLogo logo={siteData?.logo} siteName={siteData?.name ?? ""} />
              {/* Desktop Navigation */}
              <DesktopNavigation
                siteNavigationItems={siteData?.header?.navigation ?? undefined}
              />
            </div>

            {/* RIGHT SIDE */}
            <div className="hidden h-full items-center gap-2 pl-4 lg:flex">
              {siteData?.header?.showLanguageSwitcher !== false && (
                <LocaleSwitcher locale={locale} />
              )}
              <div className="flex h-8 w-px flex-1 bg-black/70" />
              {siteData?.header?.showCta && siteData.header.cta ? (
                <StrapiLink component={siteData.header.cta} />
              ) : null}
            </div>
            <NavbarMobileToggle />
          </Container>
        </div>
      </header>
      <NavbarMobileNavigation
        siteNavigationItems={siteData?.header?.navigation ?? undefined}
        primaryButtons={
          siteData?.header?.showCta && siteData.header.cta
            ? [siteData.header.cta]
            : undefined
        }
        locale={locale}
      />
    </NavbarMobileProvider>
  )
}
NavbarInner.displayName = "NavbarInner"

export default NavbarInner
