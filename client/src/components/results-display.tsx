import { useState } from "react";
import type { NumerologyResult } from "@shared/schema";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import DevelopmentRecommendations from "./development-recommendations";
import DNAVisualization from "./dna-visualization";
import StrengthsWeaknessesChart from "./strengths-weaknesses-chart";
import AICoach from "./ai-coach";
import NumerologyJournal from "./numerology-journal";
import ConstellationBackground from "./constellation-background";

interface Props {
  result: NumerologyResult;
  onReset: () => void;
}

const NUMBER_MEANINGS = {
  1: {
    title: "The Leader",
    strengths: ["Independent", "Creative", "Original", "Ambitious", "Determined"],
    weaknesses: ["Stubborn", "Dominant", "Impatient", "Self-centered"]
  },
  2: {
    title: "The Mediator",
    strengths: ["Diplomatic", "Cooperative", "Patient", "Sensitive", "Supportive"],
    weaknesses: ["Oversensitive", "Indecisive", "Fearful", "Dependent"]
  },
  3: {
    title: "The Communicator",
    strengths: ["Creative", "Expressive", "Social", "Optimistic", "Inspiring"],
    weaknesses: ["Scattered", "Superficial", "Critical", "Unfocused"]
  },
  4: {
    title: "The Builder",
    strengths: ["Practical", "Organized", "Determined", "Reliable", "Focused"],
    weaknesses: ["Rigid", "Stubborn", "Limited", "Too serious"]
  },
  5: {
    title: "The Freedom Explorer",
    strengths: ["Adaptable", "Versatile", "Progressive", "Dynamic", "Adventurous"],
    weaknesses: ["Restless", "Inconsistent", "Noncommittal", "Scattered"]
  },
  6: {
    title: "The Nurturer",
    strengths: ["Responsible", "Caring", "Loving", "Protective", "Balanced"],
    weaknesses: ["Anxious", "Meddling", "Self-sacrificing", "Worried"]
  },
  7: {
    title: "The Seeker",
    strengths: ["Analytical", "Introspective", "Studious", "Refined", "Wise"],
    weaknesses: ["Distant", "Critical", "Aloof", "Perfectionist"]
  },
  8: {
    title: "The Achiever",
    strengths: ["Powerful", "Successful", "Confident", "Authoritative", "Abundant"],
    weaknesses: ["Materialistic", "Domineering", "Workaholic", "Unforgiving"]
  },
  9: {
    title: "The Humanitarian",
    strengths: ["Compassionate", "Generous", "Romantic", "Creative", "Universal"],
    weaknesses: ["Aloof", "Scattered", "Unrealistic", "Resentful"]
  },
  11: {
    title: "The Master Intuitive",
    strengths: ["Intuitive", "Inspirational", "Idealistic", "Visionary", "Spiritual"],
    weaknesses: ["Stressed", "Sensitive", "Impractical", "Dreamy"]
  },
  22: {
    title: "The Master Builder",
    strengths: ["Practical", "Powerful", "Disciplined", "Ambitious", "Achiever"],
    weaknesses: ["Overburdened", "Anxious", "Pressured", "Unfulfilled"]
  },
  44: {
    title: "The Master Structurer (44/8)",
    strengths: [
      "Bridge between material and spiritual realms",
      "Exceptional ability to build lasting structures",
      "Powerful manifestation through discipline",
      "Heightened sense of responsibility",
      "Deep understanding of universal laws",
      "---Base 8 Qualities---",
      "Strong manifestation abilities",
      "Natural business acumen",
      "Powerful leadership qualities",
      "Material and financial success"
    ],
    weaknesses: [
      "Double intensity of karmic lessons",
      "Risk of overwhelm from high expectations",
      "Challenge balancing material/spiritual",
      "Tendency toward perfectionism",
      "---Base 8 Challenges---",
      "Strong ego tendencies",
      "Must be careful with power",
      "Can be too focused on material success",
      "Risk of misusing authority"
    ]
  }
} as const;

function NumberDisplay({ number, title }: { number: number; title: string }) {
  const [isOpen, setIsOpen] = useState(false);

  // Use either the direct number meaning or combine 44 with 8 if it's 44
  const meaning = number === 44 ? {
    title: "The Master Structurer (44/8)",
    strengths: [
      ...NUMBER_MEANINGS[44].strengths,
      "---Base 8 Qualities---",
      ...NUMBER_MEANINGS[8].strengths
    ],
    weaknesses: [
      ...NUMBER_MEANINGS[44].weaknesses,
      "---Base 8 Challenges---",
      ...NUMBER_MEANINGS[8].weaknesses
    ]
  } : (NUMBER_MEANINGS[number as keyof typeof NUMBER_MEANINGS] ||
    NUMBER_MEANINGS[(number % 9 || 9) as keyof typeof NUMBER_MEANINGS]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div
          className="text-center p-4 rounded-lg bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors"
          onClick={() => setIsOpen(true)}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-light text-primary"
          >
            {number}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-muted-foreground mt-1"
          >
            {title}
          </motion.div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {title}: {number} - {meaning.title}
          </DialogTitle>
          <DialogDescription>
            Explore the meaning and characteristics of this number
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <h4 className="text-sm font-medium mb-2 text-primary">Strengths</h4>
            <ul className="list-disc pl-5 space-y-1">
              {meaning.strengths.map((strength, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-sm"
                >
                  {strength}
                </motion.li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2 text-primary">Challenges</h4>
            <ul className="list-disc pl-5 space-y-1">
              {meaning.weaknesses.map((weakness, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-sm"
                >
                  {weakness}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ResultsDisplay({ result, onReset }: Props) {
  const [activeAccordion, setActiveAccordion] = useState<string | undefined>();

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 relative"
    >
      {/* Position constellation background with negative z-index and no pointer events */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <ConstellationBackground className="opacity-10" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center relative z-10"
      >
        <h2 className="text-2xl font-semibold mb-2">
          Numerology Reading for {result.name}
        </h2>
        <p className="text-muted-foreground">
          Based on your birth date: {formatDate(result.birthdate)}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10"
      >
        <NumberDisplay number={result.lifePath} title="Life Path Number" />
        <NumberDisplay number={result.destiny} title="Destiny Number" />
        <NumberDisplay number={result.birthDateNum} title="Birth Date Number" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10"
      >
        <NumberDisplay number={result.expression} title="Expression Number" />
        <NumberDisplay number={result.personality} title="Personality Number" />
        <NumberDisplay number={result.attribute} title="Attribute Number" />
      </motion.div>

      <Separator />

      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold mb-4">Numerological Profile</h3>
          <DNAVisualization result={result} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-xl font-semibold mb-4">Personal Traits Analysis</h3>
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-xl font-semibold mb-4">Detailed Analysis</h3>
          <Accordion
            type="single"
            collapsible
            value={activeAccordion}
            onValueChange={setActiveAccordion}
            className="w-full"
          >
            <AccordionItem value="overview">
              <AccordionTrigger>Overview</AccordionTrigger>
              <AccordionContent>
                Your Life Path number {result.lifePath} indicates your primary life direction and purpose.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="lifepath">
              <AccordionTrigger>Life Path Number {result.lifePath}</AccordionTrigger>
              <AccordionContent>
                Your Life Path number reveals your core mission and the lessons you're here to learn.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="destiny">
              <AccordionTrigger>Destiny Number {result.destiny}</AccordionTrigger>
              <AccordionContent>
                Your Destiny number shows the qualities and capabilities you're meant to develop.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="heartdesire">
              <AccordionTrigger>Heart's Desire Number {result.heartDesire}</AccordionTrigger>
              <AccordionContent>
                Your Heart's Desire number reveals your inner motivations and what truly fulfills you.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="expression">
              <AccordionTrigger>Expression Number {result.expression}</AccordionTrigger>
              <AccordionContent>
                Your Expression number represents your natural talents and abilities.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="personality">
              <AccordionTrigger>Personality Number {result.personality}</AccordionTrigger>
              <AccordionContent>
                Your Personality number shows how others perceive you and your outer personality.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="attribute">
              <AccordionTrigger>Attribute Number {result.attribute}</AccordionTrigger>
              <AccordionContent>
                Your Attribute number reveals special qualities you possess.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="birthdate">
              <AccordionTrigger>Birth Date Number {result.birthDateNum}</AccordionTrigger>
              <AccordionContent>
                Your Birth Date number reveals the energies and influences present at your birth.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="text-xl font-semibold mb-4">Personal Development Path</h3>
          <DevelopmentRecommendations
            recommendations={result.recommendations}
            summary={result.interpretations.developmentSummary}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-xl font-semibold mb-4">Personal Development Coach</h3>
          <AICoach result={result} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <h3 className="text-xl font-semibold mb-4">Personal Journal</h3>
        <NumerologyJournal result={result} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
      >
        <Button variant="outline" onClick={onReset} className="w-full">
          Calculate Another Reading
        </Button>
      </motion.div>
    </motion.div>
  );
}