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
import { DailyForecast } from "./daily-forecast";
import { ResultsBackground } from "./results-background";

interface Props {
  result: NumerologyResult;
  onReset: () => void;
  onCompatibility: () => void;
}

// Define NUMBER_MEANINGS type
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div
          className={`text-center p-4 rounded-lg cursor-pointer transition-colors
            ${isMasterNumber ? 'bg-primary/20 hover:bg-primary/30' :
              isWealthNumber ? 'bg-amber-500/20 hover:bg-amber-500/30' :
              'bg-primary/5 hover:bg-primary/10'}`}
        >
          <h3 className="font-medium text-sm">{title}</h3>
          <p className="text-2xl font-bold">{number}</p>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}: {number}</DialogTitle>
          <DialogDescription>
            {NUMBER_MEANINGS[number as keyof typeof NUMBER_MEANINGS] && (
              <div className="space-y-4">
                <p className="text-sm">As {NUMBER_MEANINGS[number as keyof typeof NUMBER_MEANINGS].title}, you have these qualities:</p>
                <div>
                  <h4 className="font-medium mb-2">Strengths</h4>
                  <ul className="list-disc pl-4">
                    {NUMBER_MEANINGS[number as keyof typeof NUMBER_MEANINGS].strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
                {NUMBER_MEANINGS[number as keyof typeof NUMBER_MEANINGS].warning && (
                  <p className="text-amber-600">{NUMBER_MEANINGS[number as keyof typeof NUMBER_MEANINGS].warning}</p>
                )}
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default function ResultsDisplay({ result, onReset, onCompatibility }: Props) {
  const [activeAccordion, setActiveAccordion] = useState<string | undefined>();

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString();
  };

  return (
    <div className="min-h-screen w-full relative">
      {/* Background Layer */}
      <ResultsBackground result={result} />

      {/* Content Layer */}
      <div className="relative z-10 w-full min-h-screen px-2 sm:px-4 py-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="bg-background/95 backdrop-blur-sm border border-primary/20 rounded-xl p-4 sm:p-6 space-y-6">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-semibold">
                Numerology Reading for {result.name}
              </h2>
              <p className="text-muted-foreground mt-2">
                Based on your birth date: {formatDate(result.birthdate)}
              </p>
            </div>

            {/* Overview and Complete Profile Summary */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-xl font-semibold mb-4">Overview</h3>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    Your numerological profile reveals a complex interplay of energies, with your Life Path number {result.lifePath} forming the foundation of your journey. This combines with your Destiny number {result.destiny} to create a powerful alignment towards {result.lifePath === result.destiny ? "a singular focused purpose" : "a dynamic balance of different aspects"}.
                  </p>
                  <p className="leading-relaxed">
                    Your Expression number {result.expression} and Heart's Desire number {result.heartDesire} {result.expression === result.heartDesire ? "are in harmony, suggesting natural alignment between your outer and inner selves" : "create an interesting dynamic between your outer expression and inner desires"}.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-xl font-semibold mb-4">Complete Profile Summary</h3>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    Your numerological profile combines the nurturing energy of {result.lifePath} with the humanitarian wisdom of {result.destiny}, creating a unique blend of caring and universal understanding. This combination makes you an exceptionally compassionate individual with a deep sense of responsibility towards both family and humanity at large.
                  </p>
                  <p className="leading-relaxed">
                    You possess a natural ability to create harmony and beauty while understanding the broader perspective of human experiences. Your nurturing tendencies are amplified by your ability to mirror and connect with others, making you an excellent counselor and guide who can truly understand and relate to others' needs.
                  </p>
                  <p className="leading-relaxed">
                    However, this combination also presents a specific challenge: balancing your deep commitment to helping others with maintaining healthy boundaries. Learning to balance your nurturing nature with self-care and establishing clear boundaries will be crucial for your personal growth.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Number Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6"
            >
              <NumberDisplay number={result.lifePath} title="Life Path Number" />
              <NumberDisplay number={result.destiny} title="Destiny Number" />
              <NumberDisplay number={result.birthDateNum} title="Birth Date Number" />
              <NumberDisplay number={result.expression} title="Expression Number" />
              <NumberDisplay number={result.personality} title="Personality Number" />
              <NumberDisplay number={result.attribute} title="Attribute Number" />
            </motion.div>

            <Separator />

            {/* DNA Pattern */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold mb-6">Numerological DNA Pattern</h3>
              <div className="aspect-[4/3] sm:aspect-[2/1] relative">
                <DNAVisualization result={result} />
              </div>
            </motion.div>

            {/* Additional Components */}
            <div className="space-y-6">
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
              <DailyForecast result={result} />
              <AICoach result={result} />
              <NumerologyJournal result={result} />
              <CosmicEnergyMeter result={result} />
              <NumerologySoundtrack result={result} />
              <KarmaLeaderboard result={result} />
              <DevelopmentRecommendations result={result} />
            </div>

            {/* Navigation Buttons - Only at bottom */}
            <div className="flex justify-center gap-4 pt-8">
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
  );
}