import type { NumerologyResult } from "@shared/schema";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import DevelopmentRecommendations from "./development-recommendations";
import DNAVisualization from "./dna-visualization";

interface Props {
  result: NumerologyResult;
  onReset: () => void;
}

export default function ResultsDisplay({ result, onReset }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">
          Numerology Reading for {result.name}
        </h2>
        <p className="text-muted-foreground">
          Based on your birth date: {new Date(result.birthdate).toLocaleDateString()}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
        <div className="text-center p-4 rounded-lg bg-primary/5">
          <div className="text-4xl font-bold text-primary">{result.lifePath}</div>
          <div className="text-sm text-muted-foreground mt-1">Life Path Number</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-primary/5">
          <div className="text-4xl font-bold text-primary">{result.destiny}</div>
          <div className="text-sm text-muted-foreground mt-1">Destiny Number</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-primary/5">
          <div className="text-4xl font-bold text-primary">{result.birthDateNum}</div>
          <div className="text-sm text-muted-foreground mt-1">Birth Date Number</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
        <div className="text-center p-4 rounded-lg bg-primary/5">
          <div className="text-4xl font-bold text-primary">{result.expression}</div>
          <div className="text-sm text-muted-foreground mt-1">Expression Number</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-primary/5">
          <div className="text-4xl font-bold text-primary">{result.personality}</div>
          <div className="text-sm text-muted-foreground mt-1">Personality Number</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-primary/5">
          <div className="text-4xl font-bold text-primary">{result.attribute}</div>
          <div className="text-sm text-muted-foreground mt-1">Attribute Number</div>
        </div>
      </div>

      <Separator />

      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Numerological Profile</h3>
          <DNAVisualization result={result} />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Detailed Analysis</h3>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="overview">
              <AccordionTrigger>Overview</AccordionTrigger>
              <AccordionContent>
                {result.interpretations.overview}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="lifepath">
              <AccordionTrigger>Life Path Number {result.lifePath}</AccordionTrigger>
              <AccordionContent>
                {result.interpretations.lifePath}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="destiny">
              <AccordionTrigger>Destiny Number {result.destiny}</AccordionTrigger>
              <AccordionContent>
                {result.interpretations.destiny}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="heartdesire">
              <AccordionTrigger>Heart's Desire Number {result.heartDesire}</AccordionTrigger>
              <AccordionContent>
                {result.interpretations.heartDesire}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="expression">
              <AccordionTrigger>Expression Number {result.expression}</AccordionTrigger>
              <AccordionContent>
                {result.interpretations.expression}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="personality">
              <AccordionTrigger>Personality Number {result.personality}</AccordionTrigger>
              <AccordionContent>
                {result.interpretations.personality}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="attribute">
              <AccordionTrigger>Attribute Number {result.attribute}</AccordionTrigger>
              <AccordionContent>
                {result.interpretations.attribute}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="birthdate">
              <AccordionTrigger>Birth Date Number {result.birthDateNum}</AccordionTrigger>
              <AccordionContent>
                {result.interpretations.birthDateNum}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Personal Development Path</h3>
          <DevelopmentRecommendations
            recommendations={result.interpretations.recommendations}
            summary={result.interpretations.developmentSummary}
          />
        </div>
      </div>

      <Button variant="outline" onClick={onReset} className="w-full">
        Calculate Another Reading
      </Button>
    </div>
  );
}