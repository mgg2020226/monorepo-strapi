import "server-only"

import { Container } from "@repo/design-system/elementary/Container"
import type { Data } from "@repo/strapi-types"
import { ShieldCheck, UserRound, Zap } from "lucide-react"

import type { PageBuilderComponentProps } from "@repo/sections/types"
import StrapiLink from "@repo/sections/utilities/StrapiLink"
import { StrapiMediaImage } from "@repo/sections/utilities/StrapiMediaImage"

const perkIcons = {
  zap: Zap,
  "shield-check": ShieldCheck,
  "user-round": UserRound,
}

export function StrapiHeroFeatured({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.hero-featured">
}) {
  return (
    <section className="from-primary/10 via-background to-primary/5 relative isolate overflow-hidden bg-linear-to-br">
      <div
        aria-hidden="true"
        className="bg-primary/15 absolute -top-28 -right-24 -z-10 size-96 rounded-full blur-3xl"
      />
      <div
        aria-hidden="true"
        className="bg-primary/10 absolute -bottom-36 -left-24 -z-10 size-96 rounded-full blur-3xl"
      />
      <Container className="grid gap-10 px-4 py-12 sm:px-8 lg:grid-cols-2 lg:gap-14 lg:py-24">
        <div className="flex flex-col justify-center">
          {component.eyebrow && (
            <p className="text-primary mb-4 text-sm font-bold tracking-[0.18em] uppercase">
              {component.eyebrow}
            </p>
          )}
          <h1 className="max-w-3xl text-4xl leading-[1.05] font-extrabold tracking-tight md:text-6xl">
            {component.title}
          </h1>
          {component.description && (
            <p className="text-muted-foreground mt-6 max-w-xl text-lg leading-relaxed">
              {component.description}
            </p>
          )}
          {component.actions?.length ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {component.actions.map((action) => (
                <StrapiLink key={action.id} component={action} />
              ))}
            </div>
          ) : null}
          {component.perks?.length ? (
            <ul className="mt-10 grid gap-4 sm:grid-cols-3">
              {component.perks.map((perk) => {
                const Icon = perkIcons[perk.icon ?? "zap"] ?? Zap

                return (
                  <li key={perk.id} className="flex gap-3">
                    <span className="bg-primary/10 text-primary mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full">
                      <Icon aria-hidden="true" size={18} />
                    </span>
                    <span>
                      <span className="block font-semibold">{perk.title}</span>
                      {perk.description && (
                        <span className="text-muted-foreground mt-1 block text-sm">
                          {perk.description}
                        </span>
                      )}
                    </span>
                  </li>
                )
              })}
            </ul>
          ) : null}
        </div>
        {component.image && (
          <div className="bg-background/70 shadow-primary/10 relative min-h-72 overflow-hidden rounded-[2rem] border shadow-xl lg:min-h-[34rem]">
            <StrapiMediaImage
              media={component.image.media}
              alt={component.image.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
        )}
      </Container>
    </section>
  )
}

StrapiHeroFeatured.displayName = "StrapiHeroFeatured"

export default StrapiHeroFeatured
