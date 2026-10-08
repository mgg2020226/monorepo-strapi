import CkEditorRenderer from "@repo/design-system/elementary/ck-editor"
import { Container } from "@repo/design-system/elementary/Container"
import type { Data } from "@repo/strapi-types"

import type { PageBuilderComponentProps } from "@repo/sections/types"
import StrapiLink from "@repo/sections/utilities/StrapiLink"

export function StrapiHero({
  component,
}: PageBuilderComponentProps & { component: Data.Component<"sections.hero"> }) {
  const { title, description, links, tag, note } = component

  return (
    <section>
      <Container className="flex flex-col gap-6 px-4 py-8 md:flex-row lg:py-12 xl:gap-0">
        <div className="mx-auto flex flex-col items-center justify-center gap-4 md:w-2/4">
          {tag && (
            <div className="bg-background/30 mb-4 flex items-center justify-center rounded-full border px-3 py-1 shadow-sm backdrop-blur-md">
              <CkEditorRenderer htmlContent={tag} className="mb-0" />
            </div>
          )}

          <CkEditorRenderer htmlContent={title} />
          {description && (
            <CkEditorRenderer
              htmlContent={description}
              className="mx-auto max-w-168.75"
            />
          )}
          {links && (
            <div className="mx-auto flex w-full flex-col gap-2 pt-6 md:w-fit lg:flex-row lg:gap-4">
              {links.map((link) => (
                <StrapiLink
                  key={link.id}
                  component={link}
                  className="w-full lg:w-fit"
                />
              ))}
            </div>
          )}
          <CkEditorRenderer htmlContent={note} className="pt-6" />
        </div>
      </Container>
    </section>
  )
}

StrapiHero.displayName = "StrapiHero"

export default StrapiHero
