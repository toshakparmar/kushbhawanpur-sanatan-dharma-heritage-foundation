"use client";

import React from "react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/content/faq";

export function Faq() {
  const visibleFaqs = faqs.filter((f) => f.visible);

  return (
    <section id="faq" className="py-20 lg:py-28 bg-sand/30 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          hindiBadge="प्रायः पूछे जाने वाले प्रश्न"
          badge="Clarity & Trust"
          title="Frequently Asked Questions"
          description="Everything you need to know about our official channels, receipts, compliance, and seva operations."
        />

        <div className="bg-paper rounded-2xl border border-border p-6 sm:p-8 shadow-sm">
          <Accordion type="single" collapsible className="w-full">
            {visibleFaqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left font-serif font-bold text-maroon hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-ink-muted leading-relaxed font-sans pt-1">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

      </div>
    </section>
  );
}
