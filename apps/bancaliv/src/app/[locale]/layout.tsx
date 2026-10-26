import "@/styles/globals.css"

import { BancalivChrome } from "@/components/brand"
import { Toaster } from "@repo/design-system/ui/sonner"
import type { Data } from "@repo/strapi-types"
import { ThemeProvider } from "@teispace/next-themes"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

import { CsrConfigScript } from "@/components/elementary/CsrConfigScript"
import { ErrorBoundary } from "@/components/elementary/ErrorBoundary"
import { TailwindIndicator } from "@/components/elementary/TailwindIndicator"
import { ClientProviders } from "@/components/providers/ClientProviders"
import { ServerProviders } from "@/components/providers/ServerProviders"
import TrackingScripts from "@/components/providers/TrackingScripts"
import { debugStaticParams } from "@/lib/build"
import { getEnvVar } from "@/lib/env-vars"
import { fontRoboto } from "@/lib/fonts"
import { isValidLocale, routing } from "@/lib/navigation"
import { createSiteThemeStyle } from "@/lib/site-theme"
import { fetchSite } from "@/lib/strapi-api/content/server"
import { cn } from "@/lib/styles"

export function generateStaticParams() {
  const locales = routing.locales.map((locale) => ({ locale }))
  debugStaticParams(locales, "[locale]")

  return locales
}

const defaultMetadata: Metadata = {
  title: {
    template: "%s | Bancaliv",
    default: "Bancaliv — Bienestar financiero",
  },
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params
  if (!isValidLocale(locale)) return defaultMetadata

  const siteResponse = await fetchSite(locale)
  const faviconUrl = siteResponse?.data?.[0]?.favicon?.url
  if (!faviconUrl) return defaultMetadata

  const iconUrl = faviconUrl.startsWith("http")
    ? faviconUrl
    : `${getEnvVar("STRAPI_URL", true) ?? ""}${faviconUrl}`

  return { ...defaultMetadata, icons: { icon: iconUrl } }
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }
  // Enable static rendering
  // https://next-intl-docs.vercel.app/docs/getting-started/app-router/with-i18n-routing#static-rendering
  setRequestLocale(locale)
  const siteResponse = await fetchSite(locale)
  const siteData = siteResponse?.data?.[0] as
    | Data.ContentType<"api::site.site">
    | undefined
  const palette = siteData?.palette
  const themeStyle = {
    ...createSiteThemeStyle(palette),
    "--color-background": "#ffffff",
    "--color-foreground": "#241a2b",
    "--color-card": "#ffffff",
    "--color-card-foreground": "#241a2b",
    "--color-popover": "#ffffff",
    "--color-popover-foreground": "#241a2b",
    "--color-muted": "#f8f7f8",
    "--color-muted-foreground": "#6f6874",
  }

  /**
   * This allows you to make following env variables RUNTIME.
   *
   * Following variables aren't going to be embedded during the build-time. To avoid embedding,
   * you must not use "NEXT_PUBLIC_" prefix for env variable that you want to keep
   * private and dynamic at runtime.
   *
   * Instead, use this method to pass only the required env variables to the client side.
   * To access them from CSR or SSR context, read them using `getEnvVar()` helper.
   *
   * Do not include "STRAPI_URL", we want to keep it private (hence why we use proxying).
   */
  const CSR_ENVs = [
    "NODE_ENV",
    "DEBUG_STRAPI_CLIENT_API_CALLS",
    "SHOW_NON_BLOCKING_ERRORS",
    "APP_PUBLIC_URL",
    "IMGPROXY_URL",
  ]

  const csrConfig = CSR_ENVs.reduce(
    (acc, curr) => {
      acc[curr] = process.env?.[curr]

      return acc
    },
    {} as Record<string, string | undefined>
  )

  const csrConfigScript =
    "window.CSR_CONFIG = window.CSR_CONFIG || {};" +
    `window.CSR_CONFIG = ${JSON.stringify(csrConfig)};`

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen antialiased",
          fontRoboto.className,
          fontRoboto.variable
        )}
      >
        <CsrConfigScript content={csrConfigScript} />
        <TrackingScripts />
        <ThemeProvider
          attribute="class"
          forcedTheme="light"
          defaultTheme="light"
          enableSystem={false}
          storage="local"
        >
          <ServerProviders>
            <ClientProviders>
              <div
                className="site-theme text-foreground relative flex min-h-screen flex-col"
                data-contrast-mode="light"
                style={themeStyle}
              >
                <ErrorBoundary showErrorMessage>
                  <BancalivChrome
                    site={siteData ?? null}
                    mediaBaseUrl={getEnvVar("STRAPI_URL", true) ?? ""}
                    part="header"
                  />
                </ErrorBoundary>

                <div className="flex-1">
                  <div>{children}</div>
                </div>

                <BancalivChrome
                  site={siteData ?? null}
                  mediaBaseUrl={getEnvVar("STRAPI_URL", true) ?? ""}
                  part="footer"
                />

                <TailwindIndicator />

                <Toaster />
              </div>
            </ClientProviders>
          </ServerProviders>
        </ThemeProvider>
      </body>
    </html>
  )
}
