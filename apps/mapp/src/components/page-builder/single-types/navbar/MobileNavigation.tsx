"use client"

import { Button } from "@repo/design-system/ui/button"
import StrapiLink from "@repo/sections/utilities/StrapiLink"
import type { Data } from "@repo/strapi-types"
import { X } from "lucide-react"
import type { Locale } from "next-intl"

import LocaleSwitcher from "@/components/elementary/LocaleSwitcher"
import { NavbarAuthSection } from "@/components/page-builder/single-types/navbar/NavbarAuthSection"
import { cn } from "@/lib/styles"
import type { BetterAuthSessionWithStrapi } from "@/types/better-auth"

interface MobileNavigationProps {
  isOpen: boolean
  setOpen: (open: boolean) => void
  primaryButtons?: Data.Component<"ui.link">[]
  siteNavigationItems?: Data.Component<"site.navigation-item">[]
  session?: BetterAuthSessionWithStrapi | null
  locale?: Locale
}

export function MobileNavigation({
  siteNavigationItems,
  primaryButtons,
  isOpen,
  setOpen,
  session,
  locale,
}: MobileNavigationProps) {
  if (!siteNavigationItems?.length) return null

  return (
    <nav
      className={cn(
        "bg-background fixed inset-0 z-50 flex size-full flex-1 flex-col",
        "transition-transform duration-300 lg:hidden",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="relative flex h-16 items-center border-b px-6">
        {/* Back */}
        <span />

        {/* Center label */}

        {/* Close */}
        <Button
          variant="ghost"
          onClick={() => {
            setOpen(false)
          }}
          className="ml-auto"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col divide-y overflow-y-auto">
        {siteNavigationItems.map((item) => (
          <StrapiLink
            key={item.id}
            component={item}
            onClick={() => setOpen(false)}
            className="flex min-h-17 w-full items-center px-6 py-5 text-lg"
          />
        ))}
      </div>
      {/* FOOTER */}
      <div className="mt-auto space-y-4 border-t px-6 py-4">
        {/* Auth + Locale */}
        {/* TO DO: these components should be changed to mobile view in the future */}
        <div className="flex w-full items-center justify-between gap-2">
          <NavbarAuthSection sessionSSR={session} />
          {locale ? <LocaleSwitcher locale={locale} /> : null}
        </div>
        {primaryButtons?.length ? (
          <div className="space-y-2">
            {primaryButtons.map((button) => (
              <StrapiLink
                key={button.id}
                component={button}
                onClick={() => setOpen(false)}
                className="w-full"
              />
            ))}
          </div>
        ) : null}
      </div>
    </nav>
  )
}
