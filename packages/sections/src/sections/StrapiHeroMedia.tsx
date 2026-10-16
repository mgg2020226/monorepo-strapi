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

export function StrapiHeroMedia({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.hero-media">
}) {
  const videoUrl = resolveVideoUrl(component.video?.url ?? component.videoUrl)
  const backgroundImage = component.image ?? component.poster
  const centered = component.alignment === "center"

  return (
    <section className="bg-foreground text-background relative isolate flex min-h-[42rem] items-center overflow-hidden py-24">
      {videoUrl ? (
        <video
          aria-hidden="true"
          src={videoUrl}
          poster={resolveVideoUrl(component.poster?.url)}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 size-full object-cover"
        />
      ) : backgroundImage ? (
        <StrapiMediaImage
          media={backgroundImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 size-full object-cover"
        />
      ) : null}
      <div aria-hidden="true" className="bg-foreground/70 absolute inset-0" />
      <div
        aria-hidden="true"
        className="from-foreground/90 via-foreground/55 to-foreground/20 absolute inset-0 bg-gradient-to-r"
      />

      <Container className="relative z-10 w-full px-4 sm:px-8">
        <div
          className={centered ? "mx-auto max-w-4xl text-center" : "max-w-3xl"}
        >
          {component.eyebrow && (
            <p className="text-primary mb-4 text-sm font-bold tracking-[0.16em] uppercase">
              {component.eyebrow}
            </p>
          )}
          <h1 className="text-background max-w-4xl text-4xl leading-[1.05] font-extrabold tracking-tight sm:text-5xl lg:text-7xl">
            {component.title}
          </h1>
          {component.description && (
            <p className="text-background/85 mt-6 max-w-2xl text-lg leading-relaxed">
              {component.description}
            </p>
          )}
          {component.actions?.length ? (
            <div
              className={`mt-8 flex flex-wrap gap-3 ${centered ? "justify-center" : ""}`}
            >
              {component.actions.map((action) => (
                <StrapiLink key={action.id} component={action} />
              ))}
            </div>
          ) : null}
          {component.perks?.length ? (
            <ul
              className={`border-background/20 mt-12 flex flex-wrap gap-x-8 gap-y-5 border-t pt-6 ${centered ? "justify-center" : ""}`}
            >
              {component.perks.map((perk) => {
                const Icon = perkIcons[perk.icon ?? "zap"] ?? Zap

                return (
                  <li key={perk.id} className="flex items-center gap-3">
                    <span className="bg-background/15 text-primary flex size-9 items-center justify-center rounded-full">
                      <Icon aria-hidden="true" size={18} />
                    </span>
                    <span>
                      <span className="text-background block font-semibold">
                        {perk.title}
                      </span>
                      {perk.description && (
                        <span className="text-background/70 mt-1 block text-sm">
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
      </Container>
    </section>
  )
}

function resolveVideoUrl(url?: string | null) {
  if (!url) return
  if (!url.startsWith("/uploads")) return url

  return process.env.STRAPI_URL ? `${process.env.STRAPI_URL}${url}` : url
}

StrapiHeroMedia.displayName = "StrapiHeroMedia"

export default StrapiHeroMedia
