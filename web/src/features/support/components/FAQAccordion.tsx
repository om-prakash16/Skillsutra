'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQAccordion({ items }: { items: FAQItem[] }) {
  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {items.map((item, i) => (
        <AccordionItem 
          key={i} 
          value={`item-${i}`} 
          className="border rounded-2xl bg-card/20 px-6 px-1 hover:border-primary/30 transition-all overflow-hidden"
        >
          <AccordionTrigger className="text-left font-bold text-lg hover:no-underline py-6">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground pb-6 text-base leading-relaxed">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
