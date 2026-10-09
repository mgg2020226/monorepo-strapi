import "server-only"

import { Container } from "@repo/design-system/elementary/Container"
import type { Data } from "@repo/strapi-types"

import type { PageBuilderComponentProps } from "@repo/sections/types"
import { StrapiMediaImage } from "@repo/sections/utilities/StrapiMediaImage"

export function StrapiProcessSteps({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.process-steps">
}) {
  return (
    <Container>
      <section className="px-4 py-10 sm:px-8 lg:py-16">
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
        <ol className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {component.steps?.map((step, index) => (
            <li
              key={step.id}
              className="relative flex flex-col items-center text-center"
            >
              {index < (component.steps?.length ?? 0) - 1 && (
                <span
                  aria-hidden="true"
                  className="border-primary/40 absolute top-14 left-[60%] hidden w-[85%] border-t-2 border-dashed lg:block"
                />
              )}
              <div className="border-primary/25 bg-background relative z-10 flex size-28 items-center justify-center rounded-full border shadow-sm">
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
