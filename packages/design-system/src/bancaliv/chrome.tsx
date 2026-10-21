"use client"

/* eslint-disable unicorn/no-declarations-before-early-exit */

import type { Data } from "@repo/strapi-types"
import { usePathname } from "next/navigation"
import { useLocale } from "next-intl"
import { useState } from "react"

function mediaUrl(media?: null | { url?: string | null }, baseUrl = "") {
  if (!media?.url) return null
  if (/^https?:\/\//i.test(media.url)) return media.url

  return `${baseUrl.replace(/\/$/, "")}${media.url}`
}

export function BancalivChrome({
  site,
  mediaBaseUrl,
  part = "both",
}: {
  site: Data.ContentType<"api::site.site"> | null
  mediaBaseUrl?: string
  part?: "header" | "footer" | "both"
}) {
  const [open, setOpen] = useState(false)
  const locale = useLocale()
  const pathname = usePathname()
  // Keep the null guard after hooks to comply with the Rules of Hooks.
  if (!site) return null
  const enabledLocales = (site.locales ?? []).filter(
    (item) => item.enabled !== false && item.locale
  )
  const defaultLocale =
    enabledLocales.find((item) => item.isDefault)?.locale ?? "es"
  const unlocalizedPath = stripLocalePrefix(
    pathname,
    enabledLocales.map((item) => item.locale ?? "")
  )
  const localizedHref = (
    href: string | null | undefined,
    targetLocale = locale
  ): string | undefined => {
    if (!href) return undefined
    if (href.startsWith("#")) {
      return `${localizedHref("/", targetLocale)}${href}`
    }
    if (/^(?:[a-z]+:|\/\/)/i.test(href)) return href
    const path = href.startsWith("/") ? href : `/${href}`
    if (
      enabledLocales.some(
        ({ locale: knownLocale }) =>
          knownLocale &&
          (path === `/${knownLocale}` || path.startsWith(`/${knownLocale}/`))
      )
    )
      return path

    return targetLocale === defaultLocale ? path : `/${targetLocale}${path}`
  }
  const siteHref = (href: string | null | undefined) => {
    if (href && /^\/nosotros(?:\/|#|$)/i.test(href)) {
      return `${localizedHref("/") ?? "/"}#nosotros`
    }

    return localizedHref(href)
  }

  const logo = mediaUrl(site.logo, mediaBaseUrl)
  const links = [...(site.header?.navigation ?? [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  )
  const footer = site.footer
  const footerColumns = footer?.columns ?? []
  const hasCompanyColumn = footerColumns.some((column) =>
    /empresa|company/i.test(column.title ?? "")
  )
  const mergedFooterLinks = footerColumns.flatMap(
    (column) => column.links ?? []
  )
  const companyLinks = hasCompanyColumn
    ? []
    : mergedFooterLinks.filter((link) =>
        /nosotros|patrimonio/i.test(link.href ?? "")
      )
  const quickLinks = hasCompanyColumn
    ? []
    : mergedFooterLinks.filter((link) => !companyLinks.includes(link))
  const visibleFooterColumns = hasCompanyColumn
    ? footerColumns
    : [
        { id: "quick-links", title: "Enlaces rápidos", links: quickLinks },
        ...(companyLinks.length
          ? [{ id: "company-links", title: "Empresa", links: companyLinks }]
          : []),
      ]
  const cta = site.header?.cta
  const clientCta = {
    label: "Soy cliente",
    href: "https://app.bancaliv.com/",
    target: "_blank" as const,
  }

  return (
    <>
      {part !== "footer" && (
        <header className="bancaliv-header bancaliv-site">
          <div className="bancaliv-container flex min-h-20 items-center justify-between gap-4">
            <a
              href={localizedHref("/")}
              aria-label={site?.name ?? "Bancaliv"}
              className="shrink-0"
            >
              {logo && (
                <img
                  src={logo}
                  alt={site?.name ?? "Bancaliv"}
                  className="h-9 w-auto"
                />
              )}
            </a>
            <nav className="hidden items-center gap-7 lg:flex">
              {links.map((link, i) => (
                <a
                  key={link.id ?? i}
                  href={siteHref(link.href)}
                  target={link.target ?? "_self"}
                  className="text-sm font-semibold text-[#514852] transition-colors hover:text-[var(--bancaliv-pink)]"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <a
                className="bancaliv-button bancaliv-button--outline hidden sm:inline-flex"
                href={clientCta.href}
                target={clientCta.target}
                rel="noreferrer"
              >
                {clientCta.label}
              </a>
              {site.header?.showCta && cta?.label && cta?.href && (
                <a
                  className="bancaliv-button"
                  href={localizedHref(cta.href)}
                  target={cta.target ?? "_self"}
                >
                  {cta.label}
                </a>
              )}
              <button
                className="rounded p-2 lg:hidden"
                aria-label="Abrir menú"
                aria-expanded={open}
                onClick={() => setOpen(!open)}
              >
                {open ? "×" : "☰"}
              </button>
            </div>
            {site.header?.showLanguageSwitcher !== false &&
              enabledLocales.length > 1 && (
                <nav
                  aria-label="Idioma"
                  className="hidden items-center gap-2 lg:flex"
                >
                  {enabledLocales.map(
                    (item) =>
                      item.locale && (
                        <a
                          key={item.id ?? item.locale}
                          href={localizedHref(unlocalizedPath, item.locale)}
                          aria-current={
                            item.locale === locale ? "page" : undefined
                          }
                          className="rounded px-2 py-1 text-xs font-bold text-[#514852] uppercase hover:text-[var(--bancaliv-pink)]"
                        >
                          {item.locale}
                        </a>
                      )
                  )}
                </nav>
              )}
          </div>
          {open && (
            <nav className="flex flex-col gap-3 border-t border-[#f0dce8] bg-white p-5 lg:hidden">
              {links.map((link, i) => (
                <a
                  key={link.id ?? i}
                  href={siteHref(link.href)}
                  target={link.target ?? "_self"}
                  onClick={() => setOpen(false)}
                  className="font-semibold"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={clientCta.href}
                target={clientCta.target}
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="bancaliv-button bancaliv-button--outline"
              >
                {clientCta.label}
              </a>
              {site.header?.showLanguageSwitcher !== false &&
                enabledLocales.length > 1 && (
                  <div
                    className="flex gap-4 border-t border-[#f0dce8] pt-3"
                    aria-label="Idioma"
                  >
                    {enabledLocales.map(
                      (item) =>
                        item.locale && (
                          <a
                            key={item.id ?? item.locale}
                            href={localizedHref(unlocalizedPath, item.locale)}
                            aria-current={
                              item.locale === locale ? "page" : undefined
                            }
                            className="text-sm font-bold text-[var(--bancaliv-pink)] uppercase"
                          >
                            {item.locale}
                          </a>
                        )
                    )}
                  </div>
                )}
            </nav>
          )}
        </header>
      )}
      {part !== "header" && (
        <footer className="bancaliv-site border-t border-[#f0dce8] bg-white">
          <div className="bancaliv-container grid gap-10 py-12 md:grid-cols-[minmax(15rem,1.2fr)_2fr]">
            <div className="space-y-5">
              {logo && (
                <a
                  href={localizedHref("/")}
                  aria-label={site.name ?? "Bancaliv"}
                >
                  <img
                    src={logo}
                    alt={site.name ?? "Bancaliv"}
                    className="h-16 w-auto object-contain"
                  />
                </a>
              )}
              {footer?.description && (
                <p className="max-w-sm text-sm leading-relaxed text-[var(--bancaliv-muted)]">
                  {footer.description}
                </p>
              )}
              {footer?.showSocialLinks && Boolean(site.socialLinks?.length) && (
                <nav
                  aria-label="Redes sociales"
                  className="flex flex-wrap gap-4"
                >
                  {site.socialLinks?.map((social, i) =>
                    social.url ? (
                      <a
                        key={social.id ?? i}
                        href={social.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-semibold text-[var(--bancaliv-pink)]"
                      >
                        {social.label || social.platform}
                      </a>
                    ) : null
                  )}
                </nav>
              )}
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {visibleFooterColumns.map((column, i) => (
                <div key={column.id ?? i}>
                  <h2 className="mb-3 font-bold text-[var(--bancaliv-pink)]">
                    {column.title}
                  </h2>
                  <ul className="space-y-2">
                    {(column.links ?? []).map((link, j) => (
                      <li key={link.id ?? j}>
                        <a
                          href={siteHref(link.href)}
                          target={link.target ?? "_self"}
                          className="text-sm text-[var(--bancaliv-muted)] hover:text-[var(--bancaliv-pink)]"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {(site.contactEmail || site.contactPhone || site.address) && (
                <div>
                  <h2 className="mb-3 font-bold text-[var(--bancaliv-pink)]">
                    {locale === "en" ? "Contact" : "Contacto"}
                  </h2>
                  <address className="space-y-2 text-sm text-[var(--bancaliv-muted)] not-italic">
                    {site.contactPhone && (
                      <p>
                        <a
                          href={`tel:${site.contactPhone.replaceAll(/\s/g, "")}`}
                        >
                          {site.contactPhone}
                        </a>
                      </p>
                    )}
                    {site.contactEmail && (
                      <p>
                        <a href={`mailto:${site.contactEmail}`}>
                          {site.contactEmail}
                        </a>
                      </p>
                    )}
                    {site.address && <p>{site.address}</p>}
                  </address>
                </div>
              )}
            </div>
          </div>
          <div className="border-t border-[#f0dce8] py-4 text-center text-xs text-[var(--bancaliv-muted)]">
            <div className="bancaliv-container flex flex-col justify-between gap-3 sm:flex-row">
              {footer?.copyright && (
                <span>
                  {footer.copyright.split("{YEAR}").join(String(currentYear()))}
                </span>
              )}
              <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2">
                {(footer?.legalLinks ?? []).map((link, i) => (
                  <a
                    key={link.id ?? i}
                    href={localizedHref(link.href)}
                    target={link.target ?? "_self"}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </footer>
      )}
    </>
  )
}

function currentYear() {
  const today = new Date()

  return today.getFullYear()
}

function stripLocalePrefix(pathname: string, locales: string[]) {
  for (const locale of locales) {
    if (!locale) continue
    if (pathname === `/${locale}`) return "/"
    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(locale.length + 1)
    }
  }

  return pathname || "/"
}
