import "server-only"

import { Container } from "@repo/design-system/elementary/Container"
import { cn } from "@repo/design-system/utils"
import type { Data } from "@repo/strapi-types"
import { ShieldCheck, UserRound, Zap } from "lucide-react"

import type { PageBuilderComponentProps } from "@repo/sections/types"
import {
  sectionContainerClass,
  sectionContentClass,
  sectionStyleProps,
} from "@repo/sections/utilities/section-style"
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
  const styleProps = sectionStyleProps(component.style)
  const backgroundImage = component.style?.layout === "background-image"

  return (
    <section
      {...styleProps}
      className={cn(styleProps.className, "relative isolate overflow-hidden")}
    >
      {component.image && (
        <div
          aria-hidden="true"
          className={
            backgroundImage
              ? "absolute inset-0 z-0"
              : "relative z-0 mx-auto mt-10 min-h-72 w-full max-w-5xl overflow-hidden rounded-3xl border shadow-xl lg:mt-0"
          }
        >
          <StrapiMediaImage
            media={component.image.media}
            alt={component.image.alt ?? ""}
            fill
            sizes={
              backgroundImage ? "100vw" : "(min-width: 1024px) 50vw, 100vw"
            }
            className="object-cover"
            priority
          />
          {backgroundImage && (
            <div className="section-style-image-overlay absolute inset-0" />
          )}
        </div>
      )}
      <div
        aria-hidden="true"
        className="bg-primary/15 absolute -top-28 -right-24 -z-10 size-96 rounded-full blur-3xl"
      />
      <div
        aria-hidden="true"
        className="bg-primary/10 absolute -bottom-36 -left-24 -z-10 size-96 rounded-full blur-3xl"
      />
      <Container
        className={cn(sectionContainerClass(component.style), "relative z-10")}
      >
        <div
          className={cn(
            sectionContentClass(
              component.style,
              "flex flex-col justify-center px-4 sm:px-8"
            ),
            backgroundImage && "min-h-72 max-w-3xl lg:min-h-[34rem]"
          )}
        >
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
        </div>
        {component.perks?.length ? (
          <ul className="section-style-list mt-8 flex flex-wrap justify-start gap-x-8 gap-y-4">
            {component.perks.map((perk) => {
              const Icon = perkIcons[perk.icon ?? "zap"] ?? Zap

              return (
                <li
                  key={perk.id}
                  className="section-style-item flex items-center gap-3"
                >
                  <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-full">
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
      </Container>
    </section>
  )
}

StrapiHeroFeatured.displayName = "StrapiHeroFeatured"

export default StrapiHeroFeatured
