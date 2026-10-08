import CkEditorRenderer from "@repo/design-system/elementary/ck-editor"
import { Container } from "@repo/design-system/elementary/Container"
import { cn } from "@repo/design-system/utils"
import type { Data } from "@repo/strapi-types"

import type { PageBuilderComponentProps } from "@repo/sections/types"
import { StrapiBasicImage } from "@repo/sections/utilities/StrapiBasicImage"

export function StrapiAnimatedLogoRow({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.animated-logo-row">
}) {
  if (!component.logos) return null

  const imagesInViewport = 16
  const repeatCount =
    component.logos && component.logos.length > 0
      ? Math.max(2, Math.ceil(imagesInViewport / component.logos.length))
      : 2

  const repeatedRows = Array.from({ length: repeatCount }, (_, i) => ({
    key: `slideshow-group-${i}`,
    logos: Array.isArray(component.logos) ? component.logos : [],
  }))

  return (
    <section className="w-full px-6 py-10">
      <Container className="flex flex-col items-center gap-7.5 overflow-hidden rounded-4xl bg-linear-to-r from-purple-500/10 to-rose-300/10 py-10 shadow-sm dark:from-purple-400/20 dark:to-rose-400/20">
        <CkEditorRenderer htmlContent={component.title} />

        <div className={cn("group relative mt-12 flex w-full items-center")}>
          {repeatedRows.map((row, rowIndex) => {
            const ulAriaHidden =
              row.logos?.length > imagesInViewport && rowIndex > 0

            return (
              <ul
                key={row.key}
                className="flex shrink-0 items-center ltr:animate-[marquee_linear_infinite] rtl:animate-[marqueeReverse_linear_infinite]"
                style={{
                  animationDuration: `${(row.logos?.length ?? 1) * 2}s`,
                }}
                aria-hidden={ulAriaHidden}
              >
                {row.logos?.map((logo, logoIndex) => (
                  <li
                    key={`slideshow-logo-${logo.id}`}
                    className="w-auto shrink-0 list-none px-10"
                    aria-hidden={logoIndex > imagesInViewport || ulAriaHidden}
                  >
                    <StrapiBasicImage
                      component={logo}
                      loading="eager"
                      className="icon--invert-on-dark h-10 w-auto object-contain"
                      height={40}
                    />
                  </li>
                ))}
              </ul>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

StrapiAnimatedLogoRow.displayName = "StrapiAnimatedLogoRow"

export default StrapiAnimatedLogoRow
