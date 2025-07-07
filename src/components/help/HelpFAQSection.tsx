
import React from 'react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FAQSection } from './HelpFAQData';

interface HelpFAQSectionProps {
  section: FAQSection;
}

const HelpFAQSectionComponent = ({ section }: HelpFAQSectionProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          {section.icon}
          {section.title}
          <Badge variant="secondary" className="ml-auto">
            {section.items.length} questions
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {section.items.map((item, index) => (
            <AccordionItem key={index} value={`${section.id}-${index}`}>
              <AccordionTrigger className="text-left font-medium">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default HelpFAQSectionComponent;
