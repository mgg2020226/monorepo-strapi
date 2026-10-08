import "server-only"

import type { Data } from "@repo/strapi-types"

import CkEditorRenderer from "@repo/design-system/elementary/ck-editor"
import { Container } from "@repo/design-system/elementary/Container"
import { StrapiBasicImage } from "@repo/sections/utilities/StrapiBasicImage"
import StrapiLink from "@repo/sections/utilities/StrapiLink"
import { cn } from "@repo/design-system/utils"
import type { PageBuilderComponentProps } from "@repo/sections/types"

export function StrapiCTABanner({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.cta-banner">
}) {

  const { title, description, links, features } = component
  const isThereFeatures = features && features.length > 0

  return (
    <section className="px-6 2xl:px-0">
      <Container className="dark:bg-background/80 relative isolate flex flex-col justify-center gap-6 overflow-hidden bg-rose-100/40 px-6 py-24 shadow-sm sm:rounded-3xl sm:px-16 lg:flex-row lg:gap-16">
        <div
          className={cn(
            "flex flex-col gap-6 lg:w-2/5",
            !isThereFeatures && "mx-auto"
          )}
        >
          <CkEditorRenderer htmlContent={title} />
          <CkEditorRenderer htmlContent={description} />
          <div
            className={cn(
              "flex flex-col gap-6 lg:flex-row",
              links?.length === 1
                ? "items-start justify-start"
                : "items-center justify-center"
            )}
          >
            {links?.map((link) => (
              <StrapiLink
                key={link.id}
                component={link}
                className="w-full md:w-fit"
              />
            ))}
          </div>
        </div>
        {isThereFeatures && (
          <div className="flex flex-col gap-6 lg:w-1/2 lg:flex-row">
            {features?.map(({ id, title, description, image }) => (
              <div key={id} className="flex cursor-default gap-4">
                <div className="flex flex-col gap-4">
                  {image ? (
                    <StrapiBasicImage
                      component={image}
                      width={40}
                      height={40}
                      className="size-10 object-contain"
                    />
                  ) : null}
                  <CkEditorRenderer htmlContent={title} />
                  <CkEditorRenderer htmlContent={description} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  )
}

StrapiCTABanner.displayName = "StrapiCTABanner"

export default StrapiCTABanner
