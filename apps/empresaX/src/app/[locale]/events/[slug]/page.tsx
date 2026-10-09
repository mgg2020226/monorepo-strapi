import CkEditorRenderer from "@repo/design-system/elementary/ck-editor"
import { Container } from "@repo/design-system/elementary/Container"
import { normalizePageFullPath } from "@repo/shared-data"
import { notFound } from "next/navigation"
import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { Breadcrumbs } from "@/components/elementary/Breadcrumbs"
import { getMetadataFromStrapi } from "@/lib/metadata"
import { isValidLocale } from "@/lib/navigation"
import { fetchCalendarEvent } from "@/lib/strapi-api/content/server"

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
    pathPrefix: "/events",
    uid: "api::calendar-event.calendar-event",
  })
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: rawLocale, slug } = await params
  if (!isValidLocale(rawLocale)) notFound()
  const locale = rawLocale as Locale
  const t = await getTranslations({ locale, namespace: "content" })
  const event = (await fetchCalendarEvent(slug, locale)).data
  if (!event) notFound()

  return (
    <Container className="px-4 py-12">
      <Breadcrumbs
        locale={locale}
        breadcrumbs={[
          {
            title: t("events"),
            fullPath: normalizePageFullPath(["/events"], locale),
          },
          {
            title: event.title ?? "",
            fullPath: normalizePageFullPath(["/events", slug], locale),
          },
        ]}
      />
      <article className="mx-auto max-w-224">
        <p className="text-muted-foreground text-sm">
          {String(event.startDate ?? "")} {String(event.startTime ?? "")}
        </p>
        <h1 className="mt-3 text-4xl font-bold">{event.title}</h1>
        {event.location && <p className="mt-4">{event.location}</p>}
        <CkEditorRenderer htmlContent={event.description} className="mt-10" />
        <a
          href={normalizePageFullPath(["/events"], locale)}
          className="mt-10 inline-block underline"
        >
          {t("backToEvents")}
        </a>
      </article>
    </Container>
  )
}
