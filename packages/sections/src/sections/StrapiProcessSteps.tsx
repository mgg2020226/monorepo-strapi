import "server-only"

import { Container } from "@repo/design-system/elementary/Container"
import { cn } from "@repo/design-system/utils"
import type { Data } from "@repo/strapi-types"

import type { PageBuilderComponentProps } from "@repo/sections/types"
import {
  sectionContentClass,
  sectionStyleProps,
} from "@repo/sections/utilities/section-style"
import { StrapiMediaImage } from "@repo/sections/utilities/StrapiMediaImage"

export function StrapiProcessSteps({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.process-steps">
}) {
  const styleProps = sectionStyleProps(component.style)
  const rowLayout = component.style?.layout !== "grid"

  return (
    <Container>
      <section
        {...styleProps}
        className={cn(
          styleProps.className,
          sectionContentClass(component.style, "px-4 sm:px-8")
        )}
      >
        <header className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {component.title}
          </h2>
          {component.description && (
            <p className="text-muted-foreground mt-4">
              {component.description}
            </p>
          )}
        </header>
        <ol
          className={cn(
            "section-style-list mt-12 gap-x-8 gap-y-10",
            rowLayout
              ? "flex flex-wrap justify-center lg:flex-nowrap"
              : "grid sm:grid-cols-2 lg:grid-cols-4"
          )}
        >
          {component.steps?.map((step, index) => (
            <li
              key={step.id}
              className="relative flex w-full flex-col items-center text-center"
            >
              {index < (component.steps?.length ?? 0) - 1 && (
                <span
                  aria-hidden="true"
                  className="border-primary/40 absolute top-14 left-[60%] hidden w-[85%] border-t-2 border-dashed lg:block"
                />
              )}
              <div className="border-primary/25 bg-background relative z-10 flex size-28 items-center justify-center rounded-full border shadow-sm">
                {component.style?.itemAppearance === "decorated" && (
                  <>
                    <span
                      aria-hidden="true"
                      className="section-style-dot bg-primary absolute top-1 right-5 hidden size-2 rounded-full"
                    />
                    <span
                      aria-hidden="true"
                      className="section-style-dot bg-primary absolute right-1 bottom-5 hidden size-2 rounded-full"
                    />
                    <span
                      aria-hidden="true"
                      className="section-style-dot bg-primary absolute bottom-1 left-5 hidden size-2 rounded-full"
                    />
                  </>
                )}
                <span className="bg-primary text-primary-foreground absolute -top-2 -left-2 flex size-9 items-center justify-center rounded-full font-bold">
                  {index + 1}
                </span>
                {step.icon ? (
                  <StrapiMediaImage
                    media={step.icon.media}
                    alt={step.icon.alt ?? step.title}
                    width={64}
                    height={64}
                    className="size-16 object-contain"
                  />
                ) : (
                  <span className="text-primary text-3xl font-bold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                )}
              </div>
              <h3 className="mt-6 text-xl font-bold">{step.title}</h3>
              {step.description && (
                <p className="text-muted-foreground mt-2 max-w-xs text-sm leading-relaxed">
                  {step.description}
                </p>
              )}
            </li>
          ))}
        </ol>
      </section>
    </Container>
  )
}

StrapiProcessSteps.displayName = "StrapiProcessSteps"

export default StrapiProcessSteps
