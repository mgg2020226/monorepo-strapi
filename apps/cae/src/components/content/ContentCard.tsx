import AppLink from "@repo/design-system/elementary/AppLink"

export function ContentCard({
  href,
  title,
  description,
  meta,
  readMoreLabel,
}: {
  readonly href: string
  readonly title: string
  readonly description?: string | null
  readonly meta?: string | null
  readonly readMoreLabel: string
}) {
  return (
    <article className="rounded-2xl border p-6 shadow-sm">
      {meta && <p className="text-muted-foreground text-sm">{meta}</p>}
      <h2 className="mt-2 text-2xl font-semibold">{title}</h2>
      {description && (
        <p className="text-muted-foreground mt-3">{description}</p>
      )}
      <AppLink href={href} className="mt-5 w-fit" variant="outline">
        {readMoreLabel}
      </AppLink>
    </article>
  )
}
