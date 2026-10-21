import type { ReactNode } from "react"

type Media = {
  url?: string | null
  alternativeText?: string | null
  caption?: string | null
}

type Card = {
  id?: number | string
  title?: string | null
  description?: string | null
  value?: string | null
  label?: string | null
  href?: string | null
  target?: "_self" | "_blank" | null
  linkLabel?: string | null
  image?: Media | null
}

export type BancalivSectionData = {
  id?: number | string
  sectionType?: string | null
  anchor?: string | null
  eyebrow?: string | null
  title?: string | null
  description?: string | null
  image?: Media | null
  primaryActionLabel?: string | null
  primaryActionUrl?: string | null
  primaryActionTarget?: "_self" | "_blank" | null
  secondaryActionLabel?: string | null
  secondaryActionUrl?: string | null
  secondaryActionTarget?: "_self" | "_blank" | null
  items?: Card[] | null
}

function mediaUrl(media?: Media | null) {
  if (!media?.url) return null
  if (/^https?:\/\//i.test(media.url)) return media.url
  const base = process.env.STRAPI_URL ?? ""

  return `${base.replace(/\/$/, "")}${media.url}`
}

function Image({
  media,
  className,
  alt,
}: {
  media?: Media | null
  className: string
  alt?: string
}) {
  const src = mediaUrl(media)
  if (!src) return null

  return (
    <img
      className={className}
      src={src}
      alt={alt ?? media?.alternativeText ?? media?.caption ?? ""}
    />
  )
}

function Action({
  label,
  href,
  target,
  outline = false,
}: {
  label?: string | null
  href?: string | null
  target?: "_self" | "_blank" | null
  outline?: boolean
}) {
  if (!label || !href) return null

  return (
    <a
      className={`bancaliv-button${outline ? "bancaliv-button--outline" : ""}`}
      href={href}
      target={target ?? "_self"}
      rel={target === "_blank" ? "noreferrer" : undefined}
    >
      {label}
    </a>
  )
}

function SectionHeading({
  data,
  centered = true,
}: {
  data: BancalivSectionData
  centered?: boolean
}) {
  return (
    <div
      className={
        centered ? "mx-auto mb-12 max-w-2xl text-center" : "mb-8 max-w-2xl"
      }
    >
      {data.eyebrow && (
        <p className="mb-3 text-xs font-extrabold tracking-[.18em] text-[var(--bancaliv-pink)] uppercase">
          {data.eyebrow}
        </p>
      )}
      {data.title && (
        <h2 className="text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl">
          {data.title}
        </h2>
      )}
      {data.description && (
        <p className="mt-4 leading-relaxed text-[var(--bancaliv-muted)]">
          {data.description}
        </p>
      )}
    </div>
  )
}

function CardGrid({ items, columns = 4 }: { items: Card[]; columns?: number }) {
  const grid =
    columns === 2
      ? "md:grid-cols-2"
      : columns === 3
        ? "md:grid-cols-3"
        : "sm:grid-cols-2 lg:grid-cols-4"

  return (
    <div className={`grid gap-5 ${grid}`}>
      {items.map((item, index) => (
        <article
          className="bancaliv-card p-6"
          key={item.id ?? `${item.title}-${index}`}
        >
          <Image
            media={item.image}
            className="mb-4 max-h-48 w-full rounded-xl object-cover"
            alt={item.image?.alternativeText ?? item.image?.caption ?? ""}
          />
          {item.value && (
            <p className="mb-2 text-3xl font-extrabold text-[var(--bancaliv-pink)]">
              {item.value}
            </p>
          )}
          {item.label && (
            <p className="mb-2 text-sm font-bold text-[var(--bancaliv-pink)]">
              {item.label}
            </p>
          )}
          {item.title && <h3 className="text-lg font-bold">{item.title}</h3>}
          {item.description && (
            <p className="mt-2 text-sm leading-relaxed text-[var(--bancaliv-muted)]">
              {item.description}
            </p>
          )}
          {item.href && item.linkLabel && (
            <a
              href={item.href}
              target={item.target ?? "_self"}
              rel={item.target === "_blank" ? "noreferrer" : undefined}
              className="mt-4 inline-flex font-bold text-[var(--bancaliv-pink)]"
            >
              {item.linkLabel} →
            </a>
          )}
        </article>
      ))}
    </div>
  )
}

export function BancalivSection({
  component,
}: {
  component: BancalivSectionData
}) {
  const data = component
  const items = data.items ?? []
  const id = data.anchor || undefined
  let content: ReactNode

  switch (data.sectionType) {
    case "hero":
      content = (
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            {data.eyebrow && (
              <p className="mb-4 font-bold tracking-[.16em] text-[var(--bancaliv-pink)] uppercase">
                {data.eyebrow}
              </p>
            )}
            {data.title && (
              <h1 className="text-4xl leading-[1.05] font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                {data.title}
              </h1>
            )}
            {data.description && (
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--bancaliv-muted)]">
                {data.description}
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <Action
                label={data.primaryActionLabel}
                href={data.primaryActionUrl}
                target={data.primaryActionTarget}
              />
              <Action
                label={data.secondaryActionLabel}
                href={data.secondaryActionUrl}
                target={data.secondaryActionTarget}
                outline
              />
            </div>
            {items.length > 0 && (
              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {items.map((item, i) => (
                  <div className="bancaliv-card p-3" key={item.id ?? i}>
                    <b className="block text-sm">{item.title}</b>
                    <span className="text-xs text-[var(--bancaliv-muted)]">
                      {item.description}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="relative min-h-64 rounded-3xl bg-[var(--bancaliv-blush)] p-4 sm:p-8">
            <Image
              media={data.image}
              className="h-full max-h-[540px] w-full rounded-2xl object-contain"
              alt={data.image?.alternativeText ?? data.image?.caption ?? ""}
            />
          </div>
        </div>
      )
      break
    case "steps":
      content = (
        <>
          <SectionHeading data={data} />
          <div className="relative grid gap-10 md:grid-cols-4">
            {items.map((item, index) => (
              <article
                className="relative flex flex-col items-center text-center"
                key={item.id ?? index}
              >
                <div className="relative flex size-36 items-center justify-center rounded-full border border-[#f4c7dd] bg-white">
                  {index < items.length - 1 && (
                    <span className="absolute top-1/2 left-[90%] hidden w-[90%] border-t-4 border-dotted border-[var(--bancaliv-pink)] md:block" />
                  )}
                  <span className="absolute -top-2 -left-2 z-10 flex size-10 items-center justify-center rounded-full bg-[var(--bancaliv-pink)] font-bold text-white">
                    {index + 1}
                  </span>
                  <Image
                    media={item.image}
                    className="size-24 object-contain"
                    alt={
                      item.image?.alternativeText ?? item.image?.caption ?? ""
                    }
                  />
                </div>
                {item.title && (
                  <h3 className="mt-5 text-2xl font-bold">{item.title}</h3>
                )}
                {item.description && (
                  <p className="mt-2 max-w-[200px] text-sm leading-relaxed text-[var(--bancaliv-muted)]">
                    {item.description}
                  </p>
                )}
              </article>
            ))}
          </div>
        </>
      )
      break
    case "allies":
      content = (
        <>
          <SectionHeading data={data} />
          <div className="grid grid-cols-2 items-center gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {items.map((item, index) => (
              <article
                className="flex min-h-28 items-center justify-center rounded-xl border border-[#f0dce8] bg-white p-5"
                key={item.id ?? index}
              >
                <Image
                  media={item.image}
                  className="max-h-20 max-w-full object-contain"
                  alt={item.image?.alternativeText ?? item.image?.caption ?? ""}
                />
                {!item.image && item.title && (
                  <span className="text-center font-semibold">
                    {item.title}
                  </span>
                )}
              </article>
            ))}
          </div>
        </>
      )
      break
    case "benefits":
      content = (
        <>
          <SectionHeading data={data} />
          <div className="grid gap-6 lg:grid-cols-2">
            {items.map((item, i) => (
              <article
                className="bancaliv-card grid overflow-hidden sm:grid-cols-2"
                key={item.id ?? i}
              >
                <div className="p-6 sm:p-8">
                  {item.title && (
                    <h3 className="text-xl font-bold">{item.title}</h3>
                  )}
                  {item.description && (
                    <p className="mt-2 text-sm text-[var(--bancaliv-muted)]">
                      {item.description}
                    </p>
                  )}
                </div>
                <Image
                  media={item.image}
                  className="h-full min-h-48 w-full object-cover"
                  alt={item.image?.alternativeText ?? item.image?.caption ?? ""}
                />
              </article>
            ))}
          </div>
        </>
      )
      break
    case "faq":
      content = (
        <>
          <SectionHeading data={data} />
          <div className="mx-auto max-w-3xl space-y-3">
            {items.map((item, i) => (
              <details className="bancaliv-card p-5" key={item.id ?? i}>
                <summary className="cursor-pointer font-bold">
                  {item.title}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[var(--bancaliv-muted)]">
                  {item.description}
                </p>
              </details>
            ))}
          </div>
        </>
      )
      break
    case "cta":
      content = (
        <div className="flex flex-col items-start justify-between gap-8 rounded-3xl bg-gradient-to-br from-[#8a005e] to-[#d60078] p-8 text-white sm:p-12 lg:flex-row lg:items-center">
          <div>
            {data.eyebrow && (
              <p className="mb-3 text-xs font-bold tracking-widest text-white/80 uppercase">
                {data.eyebrow}
              </p>
            )}
            {data.title && (
              <h2 className="text-3xl font-extrabold sm:text-4xl">
                {data.title}
              </h2>
            )}
            {data.description && (
              <p className="mt-4 max-w-2xl text-white/85">{data.description}</p>
            )}
          </div>
          <Action
            label={data.primaryActionLabel}
            href={data.primaryActionUrl}
            target={data.primaryActionTarget}
          />
        </div>
      )
      break
    case "content":
      content = (
        <>
          <SectionHeading
            data={{ ...data, description: null }}
            centered={false}
          />
          <div className="bancaliv-prose max-w-4xl leading-relaxed whitespace-pre-line text-[var(--bancaliv-muted)]">
            {data.description}
          </div>
        </>
      )
      break

    default:
      content = (
        <>
          <SectionHeading data={data} />
          <CardGrid
            items={items}
            columns={
              data.sectionType === "security" ||
              data.sectionType === "testimonials"
                ? 2
                : 4
            }
          />
        </>
      )
  }

  return (
    <section
      id={id}
      className={`bancaliv-section ${["hero", "products", "allies", "faq"].includes(data.sectionType ?? "") ? "bancaliv-wash" : ""}`}
    >
      <div className="bancaliv-container">{content}</div>
    </section>
  )
}
