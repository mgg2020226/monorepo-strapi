import "server-only"

import { Container } from "@repo/design-system/elementary/Container"
import { cn } from "@repo/design-system/utils"
import type { Data } from "@repo/strapi-types"
import { BadgeCheck, Eye, SearchCheck, ShieldCheck } from "lucide-react"

import type { PageBuilderComponentProps } from "@repo/sections/types"
import {
  sectionContentClass,
  sectionStyleProps,
} from "@repo/sections/utilities/section-style"
import { StrapiMediaImage } from "@repo/sections/utilities/StrapiMediaImage"

const pointIcons = {
  eye: Eye,
  "shield-check": ShieldCheck,
  "search-check": SearchCheck,
  "badge-check": BadgeCheck,
}

export function StrapiSecurityBlock({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.security-block">
}) {
  const styleProps = sectionStyleProps(component.style)

  return (
    <Container>
      <section
        {...styleProps}
        className={cn(
          styleProps.className,
          "bancaliv-security-block",
          sectionContentClass(
            component.style,
            "overflow-hidden rounded-xl border p-6 shadow-sm sm:p-10 lg:p-12"
          )
        )}
      >
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.95fr] lg:items-center">
          <div>
            <h2 className="text-primary-foreground text-3xl font-bold tracking-tight md:text-4xl">
              {component.title}
            </h2>
            {component.supportingTitle && (
              <h3 className="text-primary-foreground mt-5 text-lg font-semibold">
                {component.supportingTitle}
              </h3>
            )}
            {component.description && (
              <p className="text-primary-foreground/90 mt-7 max-w-xl leading-relaxed">
                {component.description}
              </p>
            )}
            {component.image && (
              <div className="bancaliv-security-block__logo relative mt-10 h-32 w-full max-w-[24rem]">
                <StrapiMediaImage
                  media={component.image.media}
                  alt={component.image.alt ?? component.title}
                  fill
                  sizes="384px"
                  className="object-contain"
                />
              </div>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2" role="list">
            {component.points?.map((point) => {
              const Icon =
                pointIcons[point.icon ?? "shield-check"] ?? ShieldCheck

              return (
                <article
                  key={point.id}
                  className="section-style-item text-foreground bg-background/95 rounded-2xl border p-5"
                  role="listitem"
                >
                  <span className="bancaliv-security-block__icon">
                    <Icon aria-hidden="true" size={25} />
                  </span>
                  <h3 className="mt-3 text-sm font-bold">{point.title}</h3>
                  {point.description && (
                    <p className="text-muted-foreground mt-3 text-xs leading-relaxed">
                      {point.description}
                    </p>
                  )}
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </Container>
  )
}

StrapiSecurityBlock.displayName = "StrapiSecurityBlock"

export default StrapiSecurityBlock
