import AppLink from "@repo/design-system/elementary/AppLink"
import { Container } from "@repo/design-system/elementary/Container"
import { normalizePageFullPath } from "@repo/shared-data"
import { ArrowUpRight, CalendarDays, FileText, Scale } from "lucide-react"
import { notFound } from "next/navigation"
import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { isValidLocale } from "@/lib/navigation"
import { fetchLegalPages } from "@/lib/strapi-api/content/server"

export default async function LegalIndex({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  if (!isValidLocale(rawLocale)) notFound()
  const locale = rawLocale as Locale
  const t = await getTranslations({ locale, namespace: "content" })
  const response = await fetchLegalPages(locale)

  return (
    <main className="bg-muted/25 min-h-full">
      <Container className="px-4 py-10 md:py-16">
        <section className="mx-auto max-w-6xl">
          <header className="border-border/60 from-primary/10 via-card to-card relative overflow-hidden rounded-[2rem] border bg-gradient-to-br px-6 py-9 shadow-sm md:px-12 md:py-14">
            <div
              aria-hidden="true"
              className="bg-primary/10 pointer-events-none absolute -top-20 -right-16 size-64 rounded-full blur-3xl"
            />
            <div className="relative max-w-3xl">
              <span className="border-primary/15 bg-background/80 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold tracking-[0.12em] uppercase">
                <Scale aria-hidden="true" className="size-4" />
                {t("legalEyebrow")}
              </span>
              <h1 className="text-foreground mt-5 text-4xl leading-tight font-semibold tracking-tight md:text-5xl">
                {t("legal")}
              </h1>
              <p className="text-foreground/75 mt-4 max-w-2xl text-base leading-7 md:text-lg">
                {t("legalIntro")}
              </p>
            </div>
          </header>

          {response.data.length > 0 ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:gap-6">
              {response.data.map((page) => (
                <article
                  key={page.documentId}
                  className="group border-border/70 bg-card hover:border-primary/30 hover:shadow-primary/5 flex min-h-64 flex-col rounded-3xl border p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg md:p-8"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground grid size-12 place-items-center rounded-2xl transition-colors">
                      <FileText aria-hidden="true" className="size-5" />
                    </span>
                    {page.effectiveDate && (
                      <span className="border-border/60 bg-muted/60 text-foreground/75 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium">
                        <CalendarDays aria-hidden="true" className="size-3.5" />
                        {String(page.effectiveDate)}
                      </span>
                    )}
                  </div>
                  <h2 className="text-foreground mt-6 text-xl leading-snug font-semibold tracking-tight md:text-2xl">
                    {page.title}
                  </h2>
                  <div className="mt-auto pt-6">
                    <AppLink
                      href={normalizePageFullPath(
                        ["/legal", page.slug ?? ""],
                        locale
                      )}
                      variant="link"
                      endAdornment={<ArrowUpRight aria-hidden="true" />}
                      className="text-primary w-fit px-0 font-semibold"
                    >
                      {t("readMore")}
                    </AppLink>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="border-border bg-card/70 text-muted-foreground mt-8 rounded-3xl border border-dashed px-6 py-12 text-center">
              {t("legalEmpty")}
            </div>
          )}
        </section>
      </Container>
    </main>
  )
}
