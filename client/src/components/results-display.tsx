import { useState } from "react";
import type { NumerologyResult } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import DevelopmentRecommendations from "./development-recommendations";
import DNAVisualization from "./dna-visualization";
import StrengthsWeaknessesChart from "./strengths-weaknesses-chart";
import AICoach from "./ai-coach";
import NumerologyJournal from "./numerology-journal";
import { CosmicEnergyMeter } from "./cosmic-energy-meter";
import { NumerologySoundtrack } from "./numerology-soundtrack";
import { KarmaLeaderboard } from "./karma-leaderboard";
import { PeriodicForecast } from "./periodic-forecast";
import { ResultsBackground } from "./results-background";
import { basicInterpretations } from "@shared/numerology-interpretations";
import { DownloadReportButton } from "./download-report-button";

interface Props {
  result: NumerologyResult;
  onReset: () => void;
  onCompatibility: () => void;
}

type NumberMeaning = {
  title: string;
  strengths: readonly string[];
  weaknesses: readonly string[];
  warning?: string;
};

const NUMBER_MEANINGS: Record<number, NumberMeaning> = {
  1: {
    title: "The Leader",
    strengths: ["Independent", "Creative", "Original", "Ambitious", "Strong desire for recognition", "Natural leadership abilities"],
    weaknesses: ["Ego-driven", "Stubborn", "Domineering", "Self-centered"],
    warning: "Must be mindful of excessive need for recognition and attention"
  },
  2: {
    title: "The Mediator",
    strengths: ["Diplomatic", "Cooperative", "Patient", "Sensitive", "Supportive"],
    weaknesses: ["Oversensitive", "Indecisive", "Fearful", "Dependent"]
  },
  3: {
    title: "The Creative",
    strengths: ["Expressive", "Creative", "Joyful", "Artistic", "Sociable"],
    weaknesses: ["Scattered", "Superficial", "Moody", "Critical"]
  },
  4: {
    title: "The Builder",
    strengths: ["Disciplined", "Practical", "Reliable", "Organized", "Detail-oriented"],
    weaknesses: ["Rigid", "Stubborn", "Too serious", "Limited vision"]
  },
  5: {
    title: "The Freedom Seeker",
    strengths: ["Adaptable", "Versatile", "Progressive", "Adventurous", "Free-spirited"],
    weaknesses: ["Restless", "Inconsistent", "Non-committal", "Scattered energy"]
  },
  6: {
    title: "The Nurturer",
    strengths: ["Responsible", "Loving", "Caring", "Protective", "Service-oriented"],
    weaknesses: ["Self-sacrificing", "Meddling", "Anxious", "Overbearing"]
  },
  7: {
    title: "The Seeker",
    strengths: ["Analytical", "Wise", "Spiritual", "Intellectual", "Perfectionist"],
    weaknesses: ["Distant", "Critical", "Secretive", "Skeptical"]
  },
  8: {
    title: "The Powerhouse",
    strengths: ["Ambitious", "Confident", "Business-minded", "Goal-oriented", "Material success"],
    weaknesses: ["Workaholic", "Power-hungry", "Materialistic", "Dominating"]
  },
  9: {
    title: "The Humanitarian",
    strengths: ["Compassionate", "Generous", "Idealistic", "Creative", "Universal love"],
    weaknesses: ["Aloof", "Distant", "Resentful", "Scattered focus"]
  },
  11: {
    title: "The Master Intuitive",
    strengths: ["Inspirational", "Intuitive", "Idealistic", "Illuminating", "Visionary"],
    weaknesses: ["High-strung", "Stressed", "Scattered", "Unfocused"]
  },
  22: {
    title: "The Master Builder",
    strengths: ["Practical visionary", "Masterful manifester", "Leadership", "Large-scale achievements"],
    weaknesses: ["Overwhelmed", "Too demanding", "Perfectionist", "Stress"]
  },
  33: {
    title: "The Master Teacher",
    strengths: ["Highly spiritual", "Nurturing", "Healing abilities", "Wisdom", "Compassion"],
    weaknesses: ["Self-sacrificing", "Martyr tendencies", "Overburdened", "Perfectionist"]
  },
  44: {
    title: "The Master Power",
    strengths: ["Manifesting power", "Success oriented", "Practical wisdom", "Strong foundation"],
    weaknesses: ["Too focused on success", "High expectations", "Workaholic", "Materialistic"]
  }
};

function NumberDisplay({ number, title }: { number: number; title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const isMasterNumber = [11, 22, 33, 44].includes(number);
  const isWealthNumber = number === 28;

  let interpretationFunction: (n: number) => string;
  switch (title.toLowerCase().replace(/[^a-z]/g, '')) {
    case 'lifepath':
      interpretationFunction = basicInterpretations.lifePath;
      break;
    case 'destiny':
      interpretationFunction = basicInterpretations.destiny;
      break;
    case 'heartsdesire':
      interpretationFunction = basicInterpretations.heartDesire;
      break;
    case 'expression':
      interpretationFunction = basicInterpretations.expression;
      break;
    case 'personality':
      interpretationFunction = basicInterpretations.personality;
      break;
    case 'attribute':
      interpretationFunction = basicInterpretations.attribute;
      break;
    case 'birthdate':
      interpretationFunction = basicInterpretations.birthDateNum;
      break;
    default:
      interpretationFunction = (n: number) => `Interpretation for ${title} number ${n}`;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className={`cursor-pointer rounded-lg p-4 transition-colors
          ${isMasterNumber ? 'bg-primary/20 hover:bg-primary/30' :
            isWealthNumber ? 'bg-amber-500/20 hover:bg-amber-500/30' :
            'bg-primary/10 hover:bg-primary/20'}`}>
          <h3 className="text-sm font-medium">{title}</h3>
          <p className="text-2xl font-bold">{number}</p>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}: {number}</DialogTitle>
          <DialogDescription>
            <div className="space-y-4">
              <p className="text-sm">{interpretationFunction(number)}</p>
              <div>
                <h4 className="mb-2 font-medium">Strengths</h4>
                <ul className="list-disc space-y-1 pl-4 text-left">
                  {NUMBER_MEANINGS[number as keyof typeof NUMBER_MEANINGS]?.strengths.map((s, i) => (
                    <li key={i} className="text-sm">{s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-medium">Challenges</h4>
                <ul className="list-disc space-y-1 pl-4 text-left">
                  {NUMBER_MEANINGS[number as keyof typeof NUMBER_MEANINGS]?.weaknesses.map((w, i) => (
                    <li key={i} className="text-sm">{w}</li>
                  ))}
                </ul>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default function ResultsDisplay({ result, onReset, onCompatibility }: Props) {
  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString();
  };

  const getBasicInterpretation = () => {
    const interpretation = basicInterpretations.getBasicInterpretation({
      lifePath: result.lifePath,
      destiny: result.destiny,
      heartDesire: result.heartDesire,
      expression: result.expression,
      personality: result.personality,
      attribute: result.attribute,
      birthDateNum: result.birthDateNum
    });
    return interpretation.overview || 'Your numerological profile reveals a unique combination of energies.';
  };

  const recommendations = {
    strengths: [
      ...NUMBER_MEANINGS[result.lifePath as keyof typeof NUMBER_MEANINGS]?.strengths || [],
      ...NUMBER_MEANINGS[result.destiny as keyof typeof NUMBER_MEANINGS]?.strengths || [],
    ],
    challenges: [
      ...NUMBER_MEANINGS[result.lifePath as keyof typeof NUMBER_MEANINGS]?.weaknesses || [],
      ...NUMBER_MEANINGS[result.destiny as keyof typeof NUMBER_MEANINGS]?.weaknesses || [],
    ],
    growthAreas: [
      "Developing balance between different aspects of your numerology",
      "Understanding the interplay between your numbers",
      "Maximizing the potential of your master numbers",
      "Working with your karmic influences",
    ],
    practices: [
      "Daily reflection on your life path number",
      "Regular meditation focusing on your destiny number",
      "Journal writing about your experiences",
      "Mindfulness practices aligned with your numbers",
    ]
  };

  return (
    <div className="relative min-h-screen w-full">
      <ResultsBackground result={result} />
      <div className="relative z-10 min-h-screen w-full">
        <div className="container mx-auto px-1 sm:px-4 py-6 sm:py-8">
          <div className="space-y-6 sm:space-y-8">
            {/* Title Section */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold sm:text-3xl">
                Numerology Reading for {result.name}
              </h2>
              <p className="mt-2 text-muted-foreground">
                Based on your birth date: {formatDate(result.birthdate)}
              </p>
            </div>

            {/* Overview Section */}
            <div className="text-center px-2 sm:px-4">
              <h3 className="text-xl font-semibold mb-4">Overview</h3>
              <p className="leading-relaxed max-w-3xl mx-auto">{getBasicInterpretation()}</p>
            </div>

            {/* Core Numbers Section */}
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-6">Core Numbers</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 px-1 sm:px-0">
                <NumberDisplay number={result.lifePath} title="Life Path Number" />
                <NumberDisplay number={result.destiny} title="Destiny Number" />
                <NumberDisplay number={result.heartDesire} title="Heart's Desire Number" />
                <NumberDisplay number={result.birthDateNum} title="Birth Date Number" />
                <NumberDisplay number={result.personality} title="Personality Number" />
                <NumberDisplay number={result.attribute} title="Attribute Number" />
              </div>
            </div>

            <Separator />

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-6">Detailed Analysis</h3>
                <Accordion type="single" collapsible className="w-full space-y-2">
                  <AccordionItem value="profile-summary">
                    <AccordionTrigger>Complete Profile Summary</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <p className="leading-relaxed">
                          Your Life Path number {result.lifePath} indicates: {basicInterpretations.lifePath(result.lifePath)}
                        </p>
                        <p className="leading-relaxed">
                          Your Destiny number {result.destiny} shows: {basicInterpretations.destiny(result.destiny)}
                        </p>
                        <p className="leading-relaxed">
                          Your Heart's Desire number {result.heartDesire} reveals: {basicInterpretations.heartDesire(result.heartDesire)}
                        </p>
                        <p className="leading-relaxed">
                          Your Expression number {result.expression} indicates: {basicInterpretations.expression(result.expression)}
                        </p>
                        <p className="leading-relaxed">
                          Your Personality number {result.personality} shows: {basicInterpretations.personality(result.personality)}
                        </p>
                        <p className="leading-relaxed">
                          Your Birth Date number {result.birthDateNum} reveals: {basicInterpretations.birthDateNum(result.birthDateNum)}
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {[
                    { key: 'lifePath', title: 'Life Path', number: result.lifePath },
                    { key: 'destiny', title: 'Destiny', number: result.destiny },
                    { key: "heartDesire", title: "Heart's Desire", number: result.heartDesire },
                    { key: 'expression', title: 'Expression', number: result.expression },
                    { key: 'personality', title: 'Personality', number: result.personality },
                    { key: 'attribute', title: 'Attribute', number: result.attribute },
                    { key: 'birthDateNum', title: 'Birth Date', number: result.birthDateNum }
                  ].map(({ key, title, number }) => (
                    <AccordionItem key={key} value={key}>
                      <AccordionTrigger>{title} Number {number}</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p className="text-sm leading-relaxed">
                            {basicInterpretations[key](number)}
                          </p>
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                              <h4 className="mb-2 font-medium">Strengths</h4>
                              <ul className="list-disc space-y-1 pl-4 text-left">
                                {NUMBER_MEANINGS[number as keyof typeof NUMBER_MEANINGS]?.strengths.map((strength, index) => (
                                  <li key={index} className="text-sm">{strength}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="mb-2 font-medium">Challenges</h4>
                              <ul className="list-disc space-y-1 pl-4 text-left">
                                {NUMBER_MEANINGS[number as keyof typeof NUMBER_MEANINGS]?.weaknesses.map((weakness, index) => (
                                  <li key={index} className="text-sm">{weakness}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-6">Numerological DNA Pattern</h3>
                <DNAVisualization result={result} />
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-6">Personal Traits Analysis</h3>
                <StrengthsWeaknessesChart items={[
                  {
                    label: "Leadership & Independence",
                    value: Math.min(100, (result.lifePath === 1 || result.expression === 1) ? 90 :
                      (result.lifePath === 8 || result.expression === 8) ? 85 : 70),
                    type: "strength"
                  },
                  {
                    label: "Creativity & Expression",
                    value: Math.min(100, (result.lifePath === 3 || result.expression === 3) ? 90 :
                      (result.heartDesire === 3) ? 85 : 65),
                    type: "strength"
                  },
                  {
                    label: "Analytical Thinking",
                    value: Math.min(100, (result.lifePath === 7 || result.expression === 7) ? 90 :
                      (result.personality === 7) ? 85 : 75),
                    type: "strength"
                  },
                  {
                    label: "Emotional Sensitivity",
                    value: Math.min(100, (result.lifePath === 2 || result.heartDesire === 2) ? 85 :
                      (result.personality === 2) ? 80 : 70),
                    type: result.lifePath === 2 ? "strength" : "weakness"
                  },
                  {
                    label: "Adaptability",
                    value: Math.min(100, (result.lifePath === 9 || result.expression === 9) ? 90 :
                      (result.lifePath === 5 || result.expression === 5) ? 85 : 70),
                    type: "strength"
                  },
                  {
                    label: "Focus & Discipline",
                    value: Math.min(100, (result.lifePath === 4 || result.expression === 4) ? 85 :
                      (result.personality === 4) ? 80 : 65),
                    type: result.lifePath === 4 ? "strength" : "weakness"
                  }
                ]} />
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-6">Periodic Forecasts</h3>
                <PeriodicForecast result={result} />
              </div>

              <AICoach result={result} />
              <NumerologyJournal result={result} />
              <CosmicEnergyMeter result={result} />
              <NumerologySoundtrack result={result} />
              <KarmaLeaderboard result={result} />
              <DevelopmentRecommendations
                recommendations={recommendations}
                summary={result.interpretations?.developmentSummary}
              />

              <div className="flex flex-col items-center gap-4">
                <DownloadReportButton result={result} />
                <div className="flex justify-center gap-4 w-full">
                  <Button onClick={onReset} variant="outline">
                    Start New Reading
                  </Button>
                  <Button onClick={onCompatibility} variant="outline">
                    Compatibility Reading
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}