import { Container } from "@repo/design-system/elementary/Container"
import Typography from "@repo/design-system/typography"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/design-system/ui/accordion"
import type { Data } from "@repo/strapi-types"

import type { PageBuilderComponentProps } from "@repo/sections/types"

export function StrapiFaq({
  component,
}: PageBuilderComponentProps & { component: Data.Component<"sections.faq"> }) {
  return (
    <section>
      <Container className="py-8">
        <div className="flex flex-col items-center gap-6">
          <Typography tag="h2" variant="heading3">
            {component.title}
          </Typography>
          <Typography>{component.subTitle}</Typography>

          {component.accordions && (
            <div className="w-full">
              <Accordion
                type="single"
                collapsible
                className="mx-auto w-full max-w-180"
              >
                {component.accordions.map((x) => (
                  <AccordionItem key={x.id} value={x.id.toString()}>
                    <AccordionTrigger>{x.question}</AccordionTrigger>
                    <AccordionContent>{x.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}

StrapiFaq.displayName = "StrapiFaq"

export default StrapiFaq
