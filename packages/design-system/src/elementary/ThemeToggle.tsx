"use client"

import { useTheme } from "@teispace/next-themes"
import { Moon, SunMedium } from "lucide-react"
import { useTranslations } from "next-intl"
import { useSyncExternalStore } from "react"

import { Button } from "@repo/design-system/ui/button"

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme, theme } = useTheme()
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
  const t = useTranslations()
  const label = t("comps.themeToggle.label")

  return (
    <Button
      variant="ghost"
      size="sm"
      className={className}
      aria-label={label}
      title={label}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {mounted ? (
        resolvedTheme === "dark" ? (
          <SunMedium aria-hidden="true" />
        ) : (
          <Moon aria-hidden="true" />
        )
      ) : (
        <span aria-hidden="true" className="size-3.5" />
      )}
    </Button>
  )
}
