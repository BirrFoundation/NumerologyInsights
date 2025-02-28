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
import { CosmicEnergyMeter } from "./cosmic-energy-meter";

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
                <div className="space-y-4">
                  <p className="text-sm">
                    Your numerological profile reveals a complex interplay of energies, with your Life Path number {result.lifePath} forming the foundation of your journey. This combines with your Destiny number {result.destiny} to create a powerful alignment towards {result.lifePath === result.destiny ? "a singular focused purpose" : "a dynamic balance of different aspects"}.
                  </p>
                  <p className="text-sm">
                    Your Expression number {result.expression} and Heart's Desire number {result.heartDesire} {result.expression === result.heartDesire ? "are in harmony, suggesting natural alignment between your outer and inner selves" : "create an interesting dynamic between your outer expression and inner desires"}.
                  </p>
                  <p className="text-sm">
                    The Personality number {result.personality} shapes how others perceive you, while your Birth Date number {result.birthDateNum} reveals innate talents and potential challenges. Your Attribute number {result.attribute} adds unique qualities that color your entire numerological profile.
                  </p>
                  <div className="mt-4 bg-primary/5 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Key Insights</h4>
                    <ul className="list-disc pl-4 space-y-2">
                      <li>Primary Life Direction: {NUMBER_MEANINGS[result.lifePath as keyof typeof NUMBER_MEANINGS].title}</li>
                      <li>Soul Purpose: {NUMBER_MEANINGS[result.destiny as keyof typeof NUMBER_MEANINGS].title}</li>
                      <li>Inner Motivation: {NUMBER_MEANINGS[result.heartDesire as keyof typeof NUMBER_MEANINGS].title}</li>
                      <li>External Expression: {NUMBER_MEANINGS[result.expression as keyof typeof NUMBER_MEANINGS].title}</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="lifepath">
              <AccordionTrigger>Life Path Number {result.lifePath}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <p className="text-sm">
                    Your Life Path number {result.lifePath} is one of the most significant numbers in your numerological profile. As {NUMBER_MEANINGS[result.lifePath as keyof typeof NUMBER_MEANINGS].title}, you embody qualities that shape your life's journey and core lessons.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Core Strengths</h4>
                      <ul className="list-disc pl-4 space-y-1">
                        {NUMBER_MEANINGS[result.lifePath as keyof typeof NUMBER_MEANINGS].strengths.map((strength, index) => (
                          <li key={index} className="text-sm">{strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Growth Areas</h4>
                      <ul className="list-disc pl-4 space-y-1">
                        {NUMBER_MEANINGS[result.lifePath as keyof typeof NUMBER_MEANINGS].weaknesses.map((weakness, index) => (
                          <li key={index} className="text-sm">{weakness}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 bg-primary/5 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Life Path {result.lifePath} in Relation to Other Numbers</h4>
                    <p className="text-sm">
                      {result.lifePath === result.destiny ? 
                        "Your Life Path and Destiny numbers are the same, amplifying your core purpose and providing clear direction." :
                        `Your Life Path ${result.lifePath} works with your Destiny number ${result.destiny} to create a dynamic path of growth and achievement.`}
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="destiny">
              <AccordionTrigger>Destiny Number {result.destiny}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <p className="text-sm">
                    Your Destiny number {result.destiny}, also known as the Expression number, reveals your life's purpose and the qualities you must develop to fulfill your potential. As {NUMBER_MEANINGS[result.destiny as keyof typeof NUMBER_MEANINGS].title}, you have a unique mission and set of talents.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Natural Talents</h4>
                      <ul className="list-disc pl-4 space-y-1">
                        {NUMBER_MEANINGS[result.destiny as keyof typeof NUMBER_MEANINGS].strengths.map((strength, index) => (
                          <li key={index} className="text-sm">{strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Potential Challenges</h4>
                      <ul className="list-disc pl-4 space-y-1">
                        {NUMBER_MEANINGS[result.destiny as keyof typeof NUMBER_MEANINGS].weaknesses.map((weakness, index) => (
                          <li key={index} className="text-sm">{weakness}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 bg-primary/5 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Destiny Path Influence</h4>
                    <p className="text-sm">
                      Your Destiny number influences how you achieve your goals and manifests your talents through career, relationships, and personal growth. It works in conjunction with your Expression number {result.expression} to shape your life's achievements.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="heartdesire">
              <AccordionTrigger>Heart's Desire Number {result.heartDesire}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <p className="text-sm">
                    The Heart's Desire number {result.heartDesire}, also known as the Soul Urge number, reveals your inner motivations, what truly fulfills you, and your deepest aspirations. As {NUMBER_MEANINGS[result.heartDesire as keyof typeof NUMBER_MEANINGS].title}, your inner world is rich with specific desires and needs.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Inner Strengths</h4>
                      <ul className="list-disc pl-4 space-y-1">
                        {NUMBER_MEANINGS[result.heartDesire as keyof typeof NUMBER_MEANINGS].strengths.map((strength, index) => (
                          <li key={index} className="text-sm">{strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Inner Challenges</h4>
                      <ul className="list-disc pl-4 space-y-1">
                        {NUMBER_MEANINGS[result.heartDesire as keyof typeof NUMBER_MEANINGS].weaknesses.map((weakness, index) => (
                          <li key={index} className="text-sm">{weakness}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 bg-primary/5 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Emotional Harmony</h4>
                    <p className="text-sm">
                      Your Heart's Desire number reveals what brings you emotional fulfillment and satisfaction. It interacts with your Personality number {result.personality} to create your unique approach to relationships and personal happiness.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="expression">
              <AccordionTrigger>Expression Number {result.expression}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <p className="text-sm">
                    Your Expression number {result.expression} reveals your natural talents, abilities, and the ways you express yourself to the world. As {NUMBER_MEANINGS[result.expression as keyof typeof NUMBER_MEANINGS].title}, you have unique gifts and ways of sharing them.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Expression Strengths</h4>
                      <ul className="list-disc pl-4 space-y-1">
                        {NUMBER_MEANINGS[result.expression as keyof typeof NUMBER_MEANINGS].strengths.map((strength, index) => (
                          <li key={index} className="text-sm">{strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Expression Challenges</h4>
                      <ul className="list-disc pl-4 space-y-1">
                        {NUMBER_MEANINGS[result.expression as keyof typeof NUMBER_MEANINGS].weaknesses.map((weakness, index) => (
                          <li key={index} className="text-sm">{weakness}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 bg-primary/5 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Self-Expression Dynamics</h4>
                    <p className="text-sm">
                      Your Expression number works in harmony with your Heart's Desire number {result.heartDesire} to create your unique way of being in the world. This interaction determines how effectively you can express your inner truth and manifest your desires.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="personality">
              <AccordionTrigger>Personality Number {result.personality}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <p className="text-sm">
                    Your Personality number {result.personality} represents how others see you and your first impression on the world. As {NUMBER_MEANINGS[result.personality as keyof typeof NUMBER_MEANINGS].title}, you have a distinct way of presenting yourself and interacting with others.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Social Strengths</h4>
                      <ul className="list-disc pl-4 space-y-1">
                        {NUMBER_MEANINGS[result.personality as keyof typeof NUMBER_MEANINGS].strengths.map((strength, index) => (
                          <li key={index} className="text-sm">{strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Social Challenges</h4>
                      <ul className="list-disc pl-4 space-y-1">
                        {NUMBER_MEANINGS[result.personality as keyof typeof NUMBER_MEANINGS].weaknesses.map((weakness, index) => (
                          <li key={index} className="text-sm">{weakness}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 bg-primary/5 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Social Dynamics</h4>
                    <p className="text-sm">
                      Your Personality number influences how you navigate social situations and present yourself to the world. This number works with your Expression number {result.expression} to create your unique social presence and interaction style.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="attribute">
              <AccordionTrigger>Attribute Number {result.attribute}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <p className="text-sm">
                    Your Attribute number {result.attribute} reveals special qualities and hidden talents that enhance your numerological profile. As {NUMBER_MEANINGS[result.attribute as keyof typeof NUMBER_MEANINGS].title}, you possess unique attributes that color your entire life experience.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Special Qualities</h4>
                      <ul className="list-disc pl-4 space-y-1">
                        {NUMBER_MEANINGS[result.attribute as keyof typeof NUMBER_MEANINGS].strengths.map((strength, index) => (
                          <li key={index} className="text-sm">{strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Growth Opportunities</h4>
                      <ul className="list-disc pl-4 space-y-1">
                        {NUMBER_MEANINGS[result.attribute as keyof typeof NUMBER_MEANINGS].weaknesses.map((weakness, index) => (
                          <li key={index} className="text-sm">{weakness}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 bg-primary/5 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Attribute Influence</h4>
                    <p className="text-sm">
                      Your Attribute number adds unique qualities to your numerological profile, enhancing your natural abilities and providing additional resources for personal growth and achievement.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="birthdate">
              <AccordionTrigger>Birth Date Number {result.birthDateNum}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <p className="text-sm">
                    Your Birth Date number {result.birthDateNum} reveals specific talents and potential that were present from birth. As {NUMBER_MEANINGS[result.birthDateNum as keyof typeof NUMBER_MEANINGS].title}, you have innate qualities that influence your life path.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Innate Talents</h4>
                      <ul className="list-disc pl-4 space-y-1">
                        {NUMBER_MEANINGS[result.birthDateNum as keyof typeof NUMBER_MEANINGS].strengths.map((strength, index) => (
                          <li key={index} className="text-sm">{strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Natural Challenges</h4>
                      <ul className="list-disc pl-4 space-y-1">
                        {NUMBER_MEANINGS[result.birthDateNum as keyof typeof NUMBER_MEANINGS].weaknesses.map((weakness, index) => (
                          <li key={index} className="text-sm">{weakness}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 bg-primary/5 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Birth Date Influence</h4>
                    <p className="text-sm">
                      Your Birth Date number represents karmic lessons and innate talents you brought into this life. It works with your Life Path number {result.lifePath} to shape your journey and personal development.
                    </p>
                  </div>
                </div>
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
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold mb-4">Cosmic Energy Potential</h3>
          <CosmicEnergyMeter result={result} />
        </motion.div>

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
      </div>
    </motion.div>
  );
}