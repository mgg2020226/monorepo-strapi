import "@/styles/globals.css"

import {
  NexonFooter,
  NexonHeader,
  NexonFloatingWhatsAppButton,
} from "@repo/design-system/nexon"
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
import { fontInter, fontRoboto, fontSpaceGrotesk } from "@/lib/fonts"
import { isValidLocale, routing } from "@/lib/navigation"
import { createSiteThemeStyle } from "@/lib/site-theme"
import { fetchSite } from "@/lib/strapi-api/content/server"
import { formatStrapiMediaUrl } from "@/lib/strapi-helpers"
import { cn } from "@/lib/styles"

export function generateStaticParams() {
  const locales = routing.locales.map((locale) => ({ locale }))
  debugStaticParams(locales, "[locale]")

  return locales
}

export const metadata: Metadata = {
  title: {
    template: "%s | Nexon Group",
    default: "Nexon Group",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
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
  const themeStyle = createSiteThemeStyle(palette)
  const siteLogoDarkUrl = formatStrapiMediaUrl(siteData?.logo?.url)
  const siteLogoAlt =
    siteData?.name ?? siteData?.logo?.alternativeText ?? "Nexon Group"

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
          fontRoboto.variable,
          fontInter.variable,
          fontSpaceGrotesk.variable
        )}
      >
        <CsrConfigScript content={csrConfigScript} />
        <TrackingScripts />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          storage="local"
        >
          <ServerProviders>
            <ClientProviders>
              <div
                className="site-theme nexon-site text-foreground relative flex min-h-screen flex-col"
                data-contrast-mode={palette?.contrastMode ?? "light"}
                style={themeStyle}
              >
                <ErrorBoundary showErrorMessage>
                  <NexonHeader
                    links={(siteData?.header?.navigation ?? []).map((item) => ({
                      label: item.label ?? "",
                      href: item.href ?? "#",
                    }))}
                    cta={siteData?.header?.cta?.label ?? "Hablemos"}
                    href={siteData?.header?.cta?.href ?? "#contacto"}
                    logoLightUrl={siteLogoDarkUrl}
                    logoDarkUrl={siteLogoDarkUrl}
                    logoAlt={siteLogoAlt}
                  />
                </ErrorBoundary>

                <div className="flex-1">
                  <div>{children}</div>
                </div>

                <NexonFloatingWhatsAppButton
                  href={siteData?.header?.cta?.href ?? "#contacto"}
                />

                <TailwindIndicator />

                <Toaster />

                <ErrorBoundary hideFallback>
                  <NexonFooter
                    data={{
                      description: siteData?.footer?.description ?? "",
                      copyright:
                        siteData?.footer?.copyright ??
                        "© {YEAR} Nexon Group. Todos los derechos reservados.",
                      links: (siteData?.header?.navigation ?? [])
                        .map((item) => ({
                          label: item.label ?? "",
                          href: item.href ?? "#",
                        }))
                        .concat(
                          (siteData?.footer?.legalLinks ?? []).map((item) => ({
                            label: item.label ?? "",
                            href: item.href ?? "#",
                          }))
                        ),
                      logoLightUrl: siteLogoDarkUrl,
                      logoAlt: siteLogoAlt,
                    }}
                  />
                </ErrorBoundary>
              </div>
            </ClientProviders>
          </ServerProviders>
        </ThemeProvider>
      </body>
    </html>
  )
}
