import "server-only"

import type { Data } from "@repo/strapi-types"

import { Container } from "@repo/design-system/elementary/Container"

type BancalivFaqComponent = Data.Component<"sections.faq"> & {
  image?: Data.Component<"utilities.basic-image"> | null
}

function mediaUrl(url?: string | null) {
  if (!url) return null
  if (/^https?:\/\//i.test(url)) return url

  return `${(process.env.STRAPI_URL ?? "").replace(/\/$/, "")}${url}`
}

export function BancalivFaq({
  component,
}: {
  component: BancalivFaqComponent
}) {
  const imageUrl = mediaUrl(component.image?.media?.url)

  return (
    <section className="bancaliv-faq">
      <Container>
        <div className="bancaliv-faq__panel">
          <header className="bancaliv-faq__heading">
            <h2 className="text-3xl leading-tight font-extrabold sm:text-4xl">
              {component.title}
            </h2>
            {component.subTitle && (
              <p className="mt-4 leading-relaxed text-[var(--bancaliv-muted)]">
                {component.subTitle}
              </p>
            )}
            {imageUrl && (
              <img
                className="bancaliv-faq__image"
                src={imageUrl}
                alt={component.image?.alt ?? component.title ?? ""}
              />
            )}
          </header>
          <div className="bancaliv-faq__items">
            {component.accordions?.map((item, index) => (
              <details
                className="bancaliv-faq__item"
                key={item.id ?? item.question}
                open={index === 0}
              >
                <summary>
                  <span>{item.question}</span>
                  <span aria-hidden="true" className="bancaliv-faq__toggle" />
                </summary>
                <div className="bancaliv-faq__answer">{item.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
