import AppLink from "@repo/design-system/elementary/AppLink"
import CkEditorRenderer from "@repo/design-system/elementary/ck-editor"
import { Container } from "@repo/design-system/elementary/Container"
import { normalizePageFullPath } from "@repo/shared-data"
import { ArrowLeft, CalendarDays, FileText } from "lucide-react"
import { notFound } from "next/navigation"
import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { Breadcrumbs } from "@/components/elementary/Breadcrumbs"
import { getMetadataFromStrapi } from "@/lib/metadata"
import { isValidLocale } from "@/lib/navigation"
import { fetchLegalPage } from "@/lib/strapi-api/content/server"

import styles from "../legal-layout.module.css"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!isValidLocale(locale)) return null

  return getMetadataFromStrapi({
    locale,
    slug,
    pathPrefix: "/legal",
    uid: "api::legal-page.legal-page",
  })
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: rawLocale, slug } = await params
  if (!isValidLocale(rawLocale)) notFound()
  const locale = rawLocale as Locale
  const t = await getTranslations({ locale, namespace: "content" })
  const page = (await fetchLegalPage(slug, locale)).data
  if (!page) notFound()

  const effectiveDate = page.effectiveDate

  return (
    <main className="bg-muted/25 min-h-full">
      <Container className="px-4 py-10 md:py-14">
        <div className="mx-auto max-w-5xl">
          <div className="mb-7 px-1">
            <Breadcrumbs
              locale={locale}
              breadcrumbs={[
                {
                  title: t("legal"),
                  fullPath: normalizePageFullPath(["/legal"], locale),
                },
                {
                  title: page.title ?? "",
                  fullPath: normalizePageFullPath(["/legal", slug], locale),
                },
              ]}
            />
          </div>

          <header className="border-border/60 from-primary/10 via-card to-card relative overflow-hidden rounded-[2rem] border bg-gradient-to-br px-6 py-8 shadow-sm md:px-12 md:py-12">
            <div
              aria-hidden="true"
              className="bg-primary/10 pointer-events-none absolute -top-20 -right-16 size-64 rounded-full blur-3xl"
            />
            <div className="relative">
              <span className="border-primary/15 bg-background/80 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold tracking-[0.12em] uppercase">
                <FileText aria-hidden="true" className="size-4" />
                {t("legalDocument")}
              </span>
              <h1 className="text-foreground mt-5 max-w-4xl text-3xl leading-tight font-semibold tracking-tight md:text-5xl md:leading-[1.12]">
                {page.title}
              </h1>

              {(effectiveDate || page.version) && (
                <div className="border-border/70 mt-7 flex flex-wrap gap-x-6 gap-y-3 border-t pt-5 text-sm">
                  {effectiveDate && (
                    <div className="inline-flex items-center gap-2.5">
                      <CalendarDays
                        aria-hidden="true"
                        className="text-primary size-4"
                      />
                      <span className="text-foreground/70">
                        {t("effectiveDate")}
                      </span>
                      <time
                        dateTime={String(effectiveDate)}
                        className="font-medium"
                      >
                        {String(effectiveDate)}
                      </time>
                    </div>
                  )}
                  {page.version && (
                    <div className="inline-flex items-center gap-2.5">
                      <span className="text-muted-foreground">
                        {t("version")}
                      </span>
                      <span className="font-medium">{page.version}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </header>

          <article className="border-border/70 bg-card shadow-foreground/[0.04] mt-7 overflow-hidden rounded-[2rem] border shadow-sm">
            <CkEditorRenderer
              htmlContent={page.content}
              className={`${styles.richText} px-6 py-8 md:px-12 md:py-12`}
            />
            <footer className="border-border/70 border-t px-6 py-5 md:px-12">
              <AppLink
                href={normalizePageFullPath(["/legal"], locale)}
                variant="ghost"
                startAdornment={<ArrowLeft aria-hidden="true" />}
                className="text-primary"
              >
                {t("backToLegal")}
              </AppLink>
            </footer>
          </article>
        </div>
      </Container>
    </main>
  )
}
