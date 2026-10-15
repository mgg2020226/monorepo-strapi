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
          sectionContentClass(
            component.style,
            "overflow-hidden rounded-3xl border p-6 shadow-sm sm:p-10 lg:p-14"
          )
        )}
      >
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            {component.eyebrow && (
              <p className="text-primary-foreground/90 text-sm font-bold tracking-[0.16em] uppercase">
                {component.eyebrow}
              </p>
            )}
            <h2 className="text-primary-foreground mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
              {component.title}
            </h2>
            {component.description && (
              <p className="text-primary-foreground/90 mt-4 leading-relaxed">
                {component.description}
              </p>
            )}
            {component.supportingTitle && (
              <h3 className="text-primary-foreground mt-6 text-lg font-semibold">
                {component.supportingTitle}
              </h3>
            )}
            {component.image && (
              <div className="bg-background relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl border">
                <StrapiMediaImage
                  media={component.image.media}
                  alt={component.image.alt ?? component.title}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
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
                  className="section-style-item text-foreground bg-background/95 rounded-2xl border p-6 sm:p-8"
                  role="listitem"
                >
                  <Icon aria-hidden="true" size={30} className="text-primary" />
                  <h3 className="mt-4 font-bold">{point.title}</h3>
                  {point.description && (
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
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
