"use client"

import { useNavbarMobile } from "@repo/design-system/hooks/useNavbarMobile"
import { Button } from "@repo/design-system/ui/button"
import type { Data } from "@repo/strapi-types"
import { Menu, X } from "lucide-react"
import type { Locale } from "next-intl"

import { MobileNavigation } from "@/components/page-builder/single-types/navbar/MobileNavigation"
import { cn } from "@/lib/styles"

export { NavbarMobileProvider } from "@repo/design-system/hooks/useNavbarMobile"

export function NavbarMobileToggle() {
  const [mobileOpen, setMobileOpen] = useNavbarMobile()

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("lg:hidden", mobileOpen && "hamburger-menu")}
      aria-label="Toggle menu"
      onClick={() => setMobileOpen((open) => !open)}
    >
      {mobileOpen ? <X /> : <Menu />}
    </Button>
  )
}

export function NavbarMobileNavigation({
  siteNavigationItems,
  primaryButtons,
  locale,
}: {
  readonly primaryButtons?: Data.Component<"ui.link">[]
  readonly siteNavigationItems?: Data.Component<"site.navigation-item">[]
  readonly locale: Locale
}) {
  const [mobileOpen, setMobileOpen] = useNavbarMobile()

  return (
    <MobileNavigation
      siteNavigationItems={siteNavigationItems}
      primaryButtons={primaryButtons}
      isOpen={mobileOpen}
      setOpen={setMobileOpen}
      locale={locale}
    />
  )
}
