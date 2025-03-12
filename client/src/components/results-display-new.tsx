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

interface Props {
  result: NumerologyResult;
  onReset: () => void; 
  onCompatibility: () => void;
}

const NUMBER_MEANINGS = {
  1: {
    title: "The Leader",
    strengths: ["Natural leadership abilities", "Independence", "Innovation", "Self-confidence"],
    weaknesses: ["Ego-driven behavior", "Stubbornness", "Dominance"]
  },
  2: {
    title: "The Mediator",
    strengths: ["Cooperation", "Diplomacy", "Sensitivity", "Balance"],
    weaknesses: ["Oversensitivity", "Indecision", "Dependency"]
  },
  3: {
    title: "The Creator",
    strengths: ["Creative expression", "Communication", "Joy", "Optimism"],
    weaknesses: ["Scattered energy", "Superficiality", "Lack of focus"]
  },
  4: {
    title: "The Builder",
    strengths: ["Organization", "Stability", "Dedication", "Practicality"],
    weaknesses: ["Rigidity", "Resistance to change", "Tunnel vision"]
  },
  5: {
    title: "The Freedom Seeker",
    strengths: ["Adaptability", "Freedom", "Adventure", "Change"],
    weaknesses: ["Instability", "Restlessness", "Excess"]
  },
  6: {
    title: "The Nurturer",
    strengths: ["Responsibility", "Love", "Service", "Harmony"],
    weaknesses: ["Self-sacrifice", "Meddling", "Perfectionism"]
  },
  7: {
    title: "The Seeker",
    strengths: ["Analysis", "Understanding", "Wisdom", "Spirituality"],
    weaknesses: ["Isolation", "Skepticism", "Cold behavior"]
  },
  8: {
    title: "The Achiever",
    strengths: ["Material success", "Power", "Authority", "Management"],
    weaknesses: ["Materialism", "Control issues", "Workaholic tendencies"]
  },
  9: {
    title: "The Humanitarian",
    strengths: ["Universal love", "Compassion", "Artistic talents", "Generosity"],
    weaknesses: ["Emotional baggage", "Martyrdom", "Resentment"]
  },
  11: {
    title: "The Intuitive",
    strengths: ["Spiritual insight", "Inspiration", "Idealism", "Innovation"],
    weaknesses: ["Nervous tension", "Impracticality", "High sensitivity"]
  },
  22: {
    title: "The Master Builder",
    strengths: ["Vision", "Practicality", "Leadership", "Achievement"],
    weaknesses: ["Overwhelm", "Unrealistic expectations", "Nervous tension"]
  },
  33: {
    title: "The Master Teacher",
    strengths: ["Spiritual guidance", "Healing", "Compassion", "Creativity"],
    weaknesses: ["Self-sacrifice", "Emotional burden", "High expectations"]
  },
  44: {
    title: "The Master Healer",
    strengths: ["Healing abilities", "Practical wisdom", "Foundation building", "Achievement"],
    weaknesses: ["Self-doubt", "Overwork", "Material focus"]
  }
} as const;

function NumberDisplay({ number, title }: { number: number; title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const isMasterNumber = [11, 22, 33, 44].includes(number);
  const isWealthNumber = number === 28;
  const meaning = number === 44 ? NUMBER_MEANINGS[44] :
    number === 33 ? NUMBER_MEANINGS[33] :
    number === 22 ? NUMBER_MEANINGS[22] :
    number === 11 ? NUMBER_MEANINGS[11] :
    NUMBER_MEANINGS[number % 9 || 9] as typeof NUMBER_MEANINGS[keyof typeof NUMBER_MEANINGS];
  
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
          <DialogDescription className="space-y-4 pt-4">
            <p>{meaning.title}</p>
            <div>
              <h4 className="font-medium mb-2">Strengths</h4>
              <ul className="list-disc pl-4 space-y-1">
                {meaning.strengths.map((strength, i) => (
                  <li key={i}>{strength}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Challenges</h4>
              <ul className="list-disc pl-4 space-y-1">
                {meaning.weaknesses.map((weakness, i) => (
                  <li key={i}>{weakness}</li>
                ))}
              </ul>
            </div>
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
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-primary/5">
      <div className="w-full py-8 px-2 sm:px-4">
        <div className="max-w-[1200px] mx-auto bg-background/95 backdrop-blur-sm border border-primary/20 rounded-xl p-4 sm:p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-semibold">
              Numerology Reading for {result.name}
            </h2>
            <p className="text-muted-foreground">
              Based on your birth date: {formatDate(result.birthdate)}
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={onReset} variant="outline">
                Start New Reading
              </Button>
              <Button onClick={onCompatibility} variant="outline">
                Compatibility Reading
              </Button>
            </div>
          </div>

          {/* Complete Profile Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-xl font-semibold mb-4">Complete Profile Summary</h3>
            <div className="space-y-4">
              <p className="leading-relaxed">
                Your numerological profile combines the nurturing energy of 6 with the humanitarian wisdom of 9, creating a unique blend of caring and universal understanding. This combination makes you an exceptionally compassionate individual with a deep sense of responsibility towards both family and humanity at large.
              </p>
              <p className="leading-relaxed">
                You possess a natural ability to create harmony and beauty while understanding the broader perspective of human experiences. Your nurturing tendencies (6) are amplified by your ability to mirror and connect with others (9), making you an excellent counselor and guide who can truly understand and relate to others' needs.
              </p>
              <p className="leading-relaxed">
                However, this combination also presents a specific challenge: balancing your deep commitment to helping others with maintaining healthy boundaries. You tend to take on too much responsibility for others' well-being (6) while getting involved in their affairs unnecessarily (9). Learning to balance your nurturing nature with self-care and establishing clear boundaries will be crucial for your personal growth.
              </p>
            </div>
          </motion.div>

          {/* Numbers Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
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
            <div className="rounded-xl overflow-hidden">
              <div className="aspect-square sm:aspect-[2/1]">
                <DNAVisualization result={result} />
              </div>
            </div>
          </motion.div>

          {/* Additional Components */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <DailyForecast result={result} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <AICoach result={result} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <NumerologyJournal result={result} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <CosmicEnergyMeter result={result} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <NumerologySoundtrack result={result} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <KarmaLeaderboard result={result} />
            </motion.div>
          </div>

          {/* Bottom Navigation */}
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
  );
}