import { DreamInterpretation as DreamInterpretationType } from "@shared/schema";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface DreamInterpretationProps {
  interpretation: DreamInterpretationType;
}

export function DreamInterpretation({ interpretation }: DreamInterpretationProps) {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Dream Interpretation</h3>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">Overview</h4>
            <p className="text-muted-foreground">{interpretation.overview}</p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="symbolism">
              <AccordionTrigger>Symbolism Analysis</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {Object.entries(interpretation.symbolism).map(([symbol, meaning]) => (
                    <div key={symbol} className="border-b pb-2">
                      <span className="font-medium">{symbol}:</span> {meaning}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="numerology">
              <AccordionTrigger>Numerological Insights</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium mb-2">Key Numbers</h5>
                    <div className="flex flex-wrap gap-2">
                      {interpretation.numerologicalInsights.numbers.map((num, idx) => (
                        <span key={idx} className="bg-primary/10 text-primary px-2 py-1 rounded">
                          {num}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Meanings</h5>
                    <ul className="list-disc pl-4 space-y-1">
                      {interpretation.numerologicalInsights.meanings.map((meaning, idx) => (
                        <li key={idx}>{meaning}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Guidance</h5>
                    <p className="text-muted-foreground">
                      {interpretation.numerologicalInsights.guidance}
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="actions">
              <AccordionTrigger>Recommended Actions</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-4 space-y-2">
                  {interpretation.actionSteps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div>
            <h4 className="font-medium mb-2">Personal Growth Insights</h4>
            <p className="text-muted-foreground">{interpretation.personalGrowth}</p>
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
}
