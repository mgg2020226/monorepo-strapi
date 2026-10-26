import type { Data } from "@repo/strapi-types"
import { ShieldCheck, UserRound, Zap } from "lucide-react"

type Props = {
  component: Data.Component<"sections.hero-featured">
}

function resolveMediaUrl(url?: string | null) {
  if (!url) return
  if (/^(?:https?:)?\/\//i.test(url)) return url

  return `${process.env.STRAPI_URL?.replace(/\/$/, "") ?? ""}${url}`
}

const perkIcons = {
  zap: Zap,
  "shield-check": ShieldCheck,
  "user-round": UserRound,
}

export function BancalivFeaturedHero({ component }: Props) {
  const media = component.image?.media
  const imageUrl = resolveMediaUrl(media?.url)
  const title = component.title ?? ""
  const hasReferenceHeadline =
    title.trim().replaceAll(/\s+/g, " ").toLocaleLowerCase() ===
    "impulsamos el bienestar financiero de tus colaboradores"

  return (
    <section className="bancaliv-site bancaliv-featured-hero">
      <div className="bancaliv-container bancaliv-featured-hero__grid">
        <div className="bancaliv-featured-hero__content">
          <h1 className="bancaliv-featured-hero__title">
            {hasReferenceHeadline ? (
              <>
                <span>Impulsamos el</span>
                <span className="bancaliv-featured-hero__highlight">
                  bienestar financiero
                </span>
                <span>de tus</span>
                <span>colaboradores</span>
              </>
            ) : (
              title
            )}
          </h1>
          {component.description && (
            <p className="bancaliv-featured-hero__description">
              {component.description}
            </p>
          )}
          {component.actions?.length ? (
            <div className="bancaliv-featured-hero__actions">
              {component.actions.map((action, index) => (
                <a
                  key={action.id}
                  className={`bancaliv-button${index > 0 ? "bancaliv-button--outline" : ""}`}
                  href={action.href ?? undefined}
                  target={action.target ?? "_self"}
                  rel={action.target === "_blank" ? "noreferrer" : undefined}
                >
                  {action.label}
                </a>
              ))}
            </div>
          ) : null}
          {component.perks?.length ? (
            <ul className="bancaliv-featured-hero__perks">
              {component.perks.map((perk) => {
                const Icon = perkIcons[perk.icon ?? "zap"] ?? Zap

                return (
                  <li key={perk.id} className="bancaliv-featured-hero__perk">
                    <span className="bancaliv-featured-hero__perk-icon">
                      <Icon aria-hidden="true" size={19} />
                    </span>
                    <span>
                      <strong>{perk.title}</strong>
                      {perk.description && <small>{perk.description}</small>}
                    </span>
                  </li>
                )
              })}
            </ul>
          ) : null}
        </div>
        <div className="bancaliv-featured-hero__image-wrap">
          {imageUrl && (
            // The media URL comes from the selected Strapi library relation.
            <img
              src={imageUrl}
              alt={component.image?.alt ?? media?.alternativeText ?? ""}
              className="bancaliv-featured-hero__image"
            />
          )}
        </div>
      </div>
    </section>
  )
}
