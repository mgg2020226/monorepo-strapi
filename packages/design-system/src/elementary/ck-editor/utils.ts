import type { Locale } from "next-intl"

/**
 * Function to remove empty images (images without src) from HTML content.
 */
export const removeEmptyImagesFromContent = (content?: string | null): string =>
  content?.replaceAll(
    // eslint-disable-next-line sonarjs/empty-string-repetition
    /<img\b[^>]*\bsrc\s*=\s*(['"])(?:\s*|\?(?:[^'" >]*)?)\1[^>]*>/gi,
    ""
  ) || ""

/**
 * Function to process links in HTML content, adding locale prefix to internal links.
 */
export const processLinksInHtmlContent = (
  html: string,
  locale: Locale,
  locales: readonly string[] = ["en", "es"]
) =>
  html?.replaceAll(
    /<a\b([^>]*?)\bhref=(["'])(\/[^"']*)\2([^>]*)>/gi,
    (match, beforeAttrs, quote, href, afterAttrs) => {
      const newHref = processLinkHrefAttribute(href, locale, locales)

      return `<a${beforeAttrs}href=${quote}${newHref}${quote}${afterAttrs}>`
    }
  )

const processLinkHrefAttribute = (
  href: string,
  locale: Locale,
  locales: readonly string[]
) =>
  hrefIncludesLocale(href, locales)
    ? href
    : `/${locale}${href.startsWith("/") ? "" : "/"}${href}`

const hrefIncludesLocale = (href: string, locales: readonly string[]) => {
  const localePattern = new RegExp(`^/(${locales.join("|")})`)

  return localePattern.test(href)
}
