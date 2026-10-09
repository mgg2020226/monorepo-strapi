import Typography from "@repo/design-system/typography"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/design-system/ui/accordion"

export default function AccordionSection() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>Item one</AccordionTrigger>
            <AccordionContent>
              <Typography variant="small">Content for item one</Typography>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>Item two</AccordionTrigger>
            <AccordionContent>
              <Typography variant="small">Content for item two</Typography>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
