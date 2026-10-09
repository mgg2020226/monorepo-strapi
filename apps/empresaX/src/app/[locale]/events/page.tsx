import { Container } from "@repo/design-system/elementary/Container"
import { normalizePageFullPath } from "@repo/shared-data"
import { notFound } from "next/navigation"
import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { ContentCard } from "@/components/content/ContentCard"
import { isValidLocale } from "@/lib/navigation"
import { fetchCalendarEvents } from "@/lib/strapi-api/content/server"

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  if (!isValidLocale(rawLocale)) notFound()
  const locale = rawLocale as Locale
  const t = await getTranslations({ locale, namespace: "content" })
  const response = await fetchCalendarEvents(locale)

  return (
    <Container className="px-4 py-12">
      <h1 className="text-4xl font-bold">{t("events")}</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {response.data.map((event) => (
          <ContentCard
            key={event.documentId}
            href={normalizePageFullPath(["/events", event.slug ?? ""], locale)}
            title={event.title ?? ""}
            description={event.location}
            meta={`${event.startDate ?? ""} ${event.startTime ?? ""}`}
            readMoreLabel={t("readMore")}
          />
        ))}
      </div>
    </Container>
  )
}
