import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FAQSection as FAQSectionType } from "@/types/strapi.types";

export default function FAQSection({ data }: { data: FAQSectionType }) {
  const items = data.faqs || [];

  return (
    <section id="faq" className="py-16 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold mb-4 text-brand-foreground">
          {data.title}
        </h2>
        {data.description && (
          <p className="text-brand-muted-foreground">{data.description}</p>
        )}
      </div>

      <Accordion className="space-y-4">
        {items.map((item) => (
          <AccordionItem
            key={item.id}
            value={String(item.id)}
            className="glass-list-item overflow-hidden hover:shadow-md transition-shadow px-6"
          >
            <AccordionTrigger className="font-medium text-brand-foreground hover:text-brand-primary hover:no-underline py-4">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-brand-muted-foreground leading-relaxed pb-4">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
