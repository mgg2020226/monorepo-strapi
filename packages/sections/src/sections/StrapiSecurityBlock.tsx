import "server-only"

import { Container } from "@repo/design-system/elementary/Container"
import type { Data } from "@repo/strapi-types"
import { BadgeCheck, Eye, SearchCheck, ShieldCheck } from "lucide-react"

import type { PageBuilderComponentProps } from "@repo/sections/types"
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
  return (
    <Container>
      <section className="border-primary/20 from-primary/10 via-card to-primary/5 overflow-hidden rounded-3xl border bg-linear-to-br p-6 shadow-sm sm:p-10 lg:p-14">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            {component.eyebrow && (
              <p className="text-primary text-sm font-bold tracking-[0.16em] uppercase">
                {component.eyebrow}
              </p>
            )}
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
              {component.title}
            </h2>
            {component.description && (
              <p className="text-muted-foreground mt-4 leading-relaxed">
                {component.description}
              </p>
            )}
            {component.supportingTitle && (
              <h3 className="mt-6 text-lg font-semibold">
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
          <ul className="grid gap-4 sm:grid-cols-2">
            {component.points?.map((point) => {
              const Icon =
                pointIcons[point.icon ?? "shield-check"] ?? ShieldCheck

              return (
                <li
                  key={point.id}
                  className="bg-background/85 rounded-2xl border p-5"
                >
                  <Icon aria-hidden="true" size={30} className="text-primary" />
                  <h3 className="mt-4 font-bold">{point.title}</h3>
                  {point.description && (
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                      {point.description}
                    </p>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </Container>
  )
}

StrapiSecurityBlock.displayName = "StrapiSecurityBlock"

export default StrapiSecurityBlock
