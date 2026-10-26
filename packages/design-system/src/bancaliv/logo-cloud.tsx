import "server-only"

import type { Data } from "@repo/strapi-types"

import { Container } from "../elementary/Container"

function mediaUrl(url?: string | null) {
  if (!url) return null
  if (/^https?:\/\//i.test(url)) return url

  return `${(process.env.STRAPI_URL ?? "").replace(/\/$/, "")}${url}`
}

export function BancalivLogoCloud({
  component,
}: {
  component: Data.Component<"sections.logo-cloud">
}) {
  const partners = component.logos ?? []

  return (
    <section className="bancaliv-logo-cloud">
      <Container>
        <div className="px-4 py-12 sm:px-8 lg:py-16">
          <header className="mx-auto max-w-3xl text-center">
            {component.eyebrow && (
              <p className="text-sm font-bold tracking-[0.16em] text-[var(--bancaliv-pink)] uppercase">
                {component.eyebrow}
              </p>
            )}
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
              {component.title}
            </h2>
            {component.description && (
              <p className="mt-4 leading-relaxed text-[var(--bancaliv-muted)]">
                {component.description}
              </p>
            )}
          </header>
          <ul className="bancaliv-logo-cloud__list">
            {partners.map((item) => {
              const src = mediaUrl(item.image?.media?.url)
              if (!src) return null
              const image = (
                <img
                  src={src}
                  alt={item.image?.alt ?? ""}
                  className="max-h-16 w-auto max-w-full object-contain"
                />
              )

              return (
                <li key={item.id}>
                  {item.href &&
                  /^(https?:|mailto:|tel:|\/|#)/i.test(item.href) ? (
                    <a
                      href={item.href}
                      target={
                        /^https?:/i.test(item.href) ? "_blank" : undefined
                      }
                      rel={
                        /^https?:/i.test(item.href)
                          ? "noopener noreferrer"
                          : undefined
                      }
                      aria-label={item.image?.alt ?? "Abrir sitio del aliado"}
                    >
                      {image}
                    </a>
                  ) : (
                    image
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </Container>
    </section>
  )
}
