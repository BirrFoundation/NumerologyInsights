import { useState } from "react";
import type { NumerologyResult } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
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
}

const NUMBER_MEANINGS = {
  1: {
    title: "The Leader",
    strengths: ["Independent", "Creative", "Original", "Ambitious", "Strong desire for recognition", "Natural leadership abilities"],
    weaknesses: ["Overly ego-driven", "Needs constant recognition", "Dominant", "Self-centered", "Can be overly demanding"],
    warning: "Must be mindful of excessive need for recognition and attention"
  },
  2: {
    title: "The Mediator",
    strengths: ["Diplomatic", "Cooperative", "Patient", "Sensitive", "Supportive"],
    weaknesses: ["Oversensitive", "Indecisive", "Fearful", "Dependent"]
  },
  3: {
    title: "The Creative Risk-Taker",
    strengths: ["Creative", "Expressive", "Social", "Optimistic", "Inspiring"],
    weaknesses: ["Scattered", "Risk of breaking rules/laws", "Critical", "Unfocused", "Tendency toward rebellion"],
    warning: "High likelihood of breaking rules - must be mindful of legal boundaries"
  },
  4: {
    title: "The Law Abider",
    strengths: ["Law-abiding", "Organized", "Reliable", "Disciplined", "Strong sense of justice"],
    weaknesses: ["Rigid", "Stubborn", "Limited", "Too serious"],
    guidance: "Natural respect for law and order - use this to build stable foundations"
  },
  5: {
    title: "The Freedom Seeker",
    strengths: ["Adaptable", "Versatile", "Progressive", "Dynamic", "Adventurous"],
    weaknesses: ["Addictive tendencies", "Restless", "Inconsistent", "Risk of overindulgence"],
    warning: "Must be careful with addictive tendencies and maintain balance in pursuits"
  },
  6: {
    title: "The Nurturer",
    strengths: ["Responsible", "Caring", "Loving", "Protective", "Balanced"],
    weaknesses: ["Anxious", "Meddling", "Self-sacrificing", "Worried"]
  },
  7: {
    title: "The Intellectual",
    strengths: ["Highly intelligent", "Analytical", "Spiritual", "Deep thinker", "Wise"],
    weaknesses: ["Ego-driven intellectual pride", "Critical", "Aloof", "Perfectionist"],
    warning: "Can be arrogant about intelligence - must practice humility"
  },
  8: {
    title: "The Achiever (High Karmic Number)",
    strengths: ["Powerful", "Successful", "Abundant", "Business-minded", "Authority"],
    weaknesses: ["Strong karmic consequences", "Power can corrupt", "Materialistic", "Unforgiving"],
    karmic_warning: "Must be extremely careful with actions as karmic return is amplified - both positive and negative actions return with greater force"
  },
  9: {
    title: "The Mirror",
    strengths: ["Highly adaptable", "Mirror-like qualities", "Compassionate", "Universal", "Reflects others' energies"],
    weaknesses: ["Can absorb too much", "Scattered", "Unrealistic", "Resentful"],
    special_trait: "Acts as a mirror, reflecting and adapting to the energies around them"
  },
  11: {
    title: "The Master Intuitive",
    strengths: [
      "Highly intuitive and spiritual",
      "Inspirational leadership",
      "Visionary abilities",
      "Enhanced sensitivity",
      "Channel for higher wisdom",
      "---Base 2 Qualities---",
      "Diplomatic abilities",
      "Cooperative nature",
      "Sensitivity to others",
      "Partnership oriented"
    ],
    weaknesses: [
      "Intense nervous energy",
      "High mental stress",
      "Can be overwhelmed by intuitive input",
      "Difficulty grounding",
      "---Base 2 Challenges---",
      "Oversensitivity",
      "Indecision",
      "Dependency issues"
    ],
    master_number: true,
    guidance: "Master number - must learn to handle enhanced spiritual sensitivity and intuitive abilities"
  },
  22: {
    title: "The Master Builder",
    strengths: [
      "Massive manifestation power",
      "Ability to turn dreams into reality",
      "Large-scale vision",
      "Practical mastery",
      "Material and spiritual balance",
      "---Base 4 Qualities---",
      "Strong organizational skills",
      "Reliability",
      "Practical approach",
      "Detail-oriented"
    ],
    weaknesses: [
      "Enormous pressure of potential",
      "Can be overwhelmed by possibilities",
      "Risk of not fulfilling potential",
      "---Base 4 Challenges---",
      "Rigidity",
      "Overwork",
      "Too serious"
    ],
    master_number: true,
    guidance: "Master number - requires balance between grand vision and practical implementation"
  },
  33: {
    title: "The Master Teacher",
    strengths: [
      "Highest spiritual leadership",
      "Universal compassion",
      "Healing abilities",
      "Enlightened creativity",
      "Selfless service",
      "---Base 6 Qualities---",
      "Nurturing nature",
      "Responsibility",
      "Harmonious approach"
    ],
    weaknesses: [
      "Burden of spiritual responsibility",
      "May avoid their calling",
      "Risk of martyrdom",
      "---Base 6 Challenges---",
      "Self-sacrifice",
      "Worry",
      "Interference"
    ],
    master_number: true,
    guidance: "Master number - highest spiritual teacher number, requires great responsibility"
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
    ],
    master_number: true,
    karmic_warning: "Combines master number power with 8's karmic intensity - requires exceptional care with actions"
  },
  28: {
    title: "The Wealth Harmonizer (28/1)",
    strengths: [
      "Natural wealth attraction",
      "Leadership in financial matters",
      "Balance of material and spiritual",
      "Strong manifestation abilities",
      "Good fortune in business",
      "---Base 1 Qualities---",
      "Independent nature",
      "Initiative",
      "Creative force",
      "Leadership abilities"
    ],
    weaknesses: [
      "Risk of material attachment",
      "Can be overly focused on wealth",
      "Challenge maintaining spiritual focus",
      "---Base 1 Challenges---",
      "Ego issues",
      "Need for recognition",
      "Can be too independent"
    ],
    wealth_number: true,
    guidance: "Special wealth number - indicates natural prosperity but requires balance between material success and spiritual growth"
  }
} as const;

function NumberDisplay({ number, title }: { number: number; title: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const meaning = number === 44 ? NUMBER_MEANINGS[44] :
    number === 28 ? NUMBER_MEANINGS[28] :
      (NUMBER_MEANINGS[number as keyof typeof NUMBER_MEANINGS] ||
        NUMBER_MEANINGS[(number % 9 || 9) as keyof typeof NUMBER_MEANINGS]);

  const isMasterNumber = [11, 22, 33, 44].includes(number);
  const isWealthNumber = number === 28;
  const hasKarmicWarning = meaning.karmic_warning || number === 8;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div
          className={`text-center p-4 rounded-lg cursor-pointer transition-colors
            ${isMasterNumber ? 'bg-primary/20 hover:bg-primary/30' :
              isWealthNumber ? 'bg-amber-500/20 hover:bg-amber-500/30' :
                'bg-primary/5 hover:bg-primary/10'}`}
          onClick={() => setIsOpen(true)}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-light text-primary"
          >
            {number}
            {isMasterNumber &&
              <span className="text-sm ml-1 text-primary/80">Master</span>
            }
            {isWealthNumber &&
              <span className="text-sm ml-1 text-amber-500">Wealth</span>
            }
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
          <DialogTitle className="flex items-center gap-2">
            {title}: {number} - {meaning.title}
            {isMasterNumber &&
              <span className="text-sm bg-primary/20 px-2 py-1 rounded">Master Number</span>
            }
            {isWealthNumber &&
              <span className="text-sm bg-amber-500/20 px-2 py-1 rounded">Wealth Number</span>
            }
          </DialogTitle>
          <DialogDescription>
            {isMasterNumber && "This is a powerful master number with special significance."}
            {isWealthNumber && "This number carries special wealth-generating potential."}
            {!isMasterNumber && !isWealthNumber && "Explore the meaning and characteristics of this number"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {hasKarmicWarning && (
            <div className="bg-orange-500/10 p-4 rounded-lg mb-4">
              <h4 className="text-sm font-medium text-orange-500 mb-2">Karmic Warning</h4>
              <p className="text-sm">{meaning.karmic_warning}</p>
            </div>
          )}

          {meaning.warning && (
            <div className="bg-primary/10 p-4 rounded-lg mb-4">
              <h4 className="text-sm font-medium mb-2">Important Note</h4>
              <p className="text-sm">{meaning.warning}</p>
            </div>
          )}

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

          {meaning.guidance && (
            <div className="mt-4 bg-primary/5 p-4 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Guidance</h4>
              <p className="text-sm">{meaning.guidance}</p>
            </div>
          )}

          {meaning.special_trait && (
            <div className="mt-4 bg-primary/5 p-4 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Special Characteristic</h4>
              <p className="text-sm">{meaning.special_trait}</p>
            </div>
          )}
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

  const getCompleteNumberMeaning = (number: number) => {
    if (number === 11) return "11/2";
    if (number === 22) return "22/4";
    if (number === 33) return "33/6";
    if (number === 44) return "44/8";
    if (number === 28) return "28/1";
    return number.toString();
  };

  return (
    <>
      <ResultsBackground result={result} />
      <div className="relative min-h-screen w-full px-2 sm:px-4 py-8">
        <div className="max-w-[1200px] mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-2xl sm:text-3xl font-semibold mb-2">
              Numerology Reading for {result.name}
            </h2>
            <p className="text-muted-foreground">
              Based on your birth date: {formatDate(result.birthdate)}
            </p>
          </motion.div>

          {/* Complete Profile Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-background/95 backdrop-blur-sm border border-primary/20 rounded-xl p-4 sm:p-6"
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

          {/* DNA Pattern - Mobile Responsive */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold mb-6">Numerological DNA Pattern</h3>
            <div className="bg-background/95 backdrop-blur-sm border border-primary/20 rounded-xl overflow-hidden">
              <div className="p-4">
                <div className="h-[50vh] sm:h-[400px] w-full">
                  <DNAVisualization result={result} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Rest of the content sections */}
          <div className="space-y-6">
            {/* Strengths & Weaknesses Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-xl font-semibold mb-6">Personal Traits Analysis</h3>
              <div className="bg-background/95 backdrop-blur-sm border border-primary/20 rounded-xl p-4 sm:p-6">
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
            </motion.div>

            {/* Daily Forecast */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-xl font-semibold mb-6">Daily Cosmic Forecast</h3>
              <div className="bg-background/95 backdrop-blur-sm border border-primary/20 rounded-xl">
                <DailyForecast result={result} />
              </div>
            </motion.div>

            {/* Detailed Analysis Accordion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="text-xl font-semibold mb-6">Detailed Analysis</h3>
              <div className="bg-background/95 backdrop-blur-sm border border-primary/20 rounded-xl p-4 sm:p-6">
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
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="completeSummary">
                    <AccordionTrigger>Complete Profile Summary</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="mt-6 space-y-4 bg-primary/5 p-6 rounded-lg">
                          <h4 className="font-medium text-lg">Complete Numerological Profile Summary</h4>
                          <div className="grid gap-4">
                            <div>
                              <h5 className="font-medium text-primary">Core Numbers</h5>
                              <div className="mt-2 space-y-2">
                                <p className="text-sm"><span className="font-medium">Life Path {result.lifePath}:</span> As {NUMBER_MEANINGS[result.lifePath as keyof typeof NUMBER_MEANINGS].title}, your fundamental purpose centers on {NUMBER_MEANINGS[result.lifePath as keyof typeof NUMBER_MEANINGS].strengths[0].toLowerCase()}. This number influences every aspect of your journey.</p>
                                <p className="text-sm"><span className="font-medium">Destiny {result.destiny}:</span> Your Destiny number as {NUMBER_MEANINGS[result.destiny as keyof typeof NUMBER_MEANINGS].title} reveals your ultimate life goals and the talents you're meant to develop. This number guides your achievements and life direction.</p>
                              </div>
                            </div>
                            <div>
                              <h5 className="font-medium text-primary">Inner Aspects</h5>
                              <div className="mt-2 space-y-2">
                                <p className="text-sm"><span className="font-medium">Heart's Desire {result.heartDesire}:</span> As {NUMBER_MEANINGS[result.heartDesire as keyof typeof NUMBER_MEANINGS].title}, your inner motivations drive you toward {NUMBER_MEANINGS[result.heartDesire as keyof typeof NUMBER_MEANINGS].strengths[0].toLowerCase()}. This represents your deepest wishes and emotional needs.</p>
                                <p className="text-sm"><span className="font-medium">Expression {result.expression}:</span> Your Expression number shows your natural talents as {NUMBER_MEANINGS[result.expression as keyof typeof NUMBER_MEANINGS].title}, particularly in {NUMBER_MEANINGS[result.expression as keyof typeof NUMBER_MEANINGS].strengths[0].toLowerCase()}. This represents how you express your true self.</p>
                              </div>
                            </div>
                            <div>
                              <h5 className="font-medium text-primary">External Influences</h5>
                              <div className="mt-2 space-y-2">
                                <p className="text-sm"><span className="font-medium">Personality {result.personality}:</span> As {NUMBER_MEANINGS[result.personality as keyof typeof NUMBER_MEANINGS].title}, you present yourself to the world through {NUMBER_MEANINGS[result.personality as keyof typeof NUMBER_MEANINGS].strengths[0].toLowerCase()}. This shapes others' first impressions of you.</p>
                                <p className="text-sm"><span className="font-medium">Attribute {result.attribute}:</span> Your Attribute number adds the quality of {NUMBER_MEANINGS[result.attribute as keyof typeof NUMBER_MEANINGS].strengths[0].toLowerCase()}, enhancing your overall energy.</p>
                                <p className="text-sm"><span className="font-medium">Birth Date {result.birthDateNum}:</span> Your Birth Date number as {NUMBER_MEANINGS[result.birthDateNum as keyof typeof NUMBER_MEANINGS].title} indicates innate talents in {NUMBER_MEANINGS[result.birthDateNum as keyof typeof NUMBER_MEANINGS].strengths[0].toLowerCase()}.</p>
                              </div>
                            </div>
                            <div>
                              <h5 className="font-medium text-primary">Special Number Properties</h5>
                              <div className="mt-2 space-y-2">
                                {[result.lifePath, result.destiny, result.expression, result.heartDesire].some(num => [11, 22, 33, 44].includes(num)) && (
                                  <p className="text-sm">
                                    <span className="font-medium">Master Numbers:</span> Your profile contains master number(s) ({[result.lifePath, result.destiny, result.expression, result.heartDesire].filter(num => [11, 22, 33, 44].includes(num)).join(", ")}), indicating heightened spiritual potential and responsibility.
                                  </p>
                                )}
                                {[result.lifePath, result.destiny, result.expression, result.heartDesire].includes(28) && (
                                  <p className="text-sm">
                                    <span className="font-medium">Wealth Number:</span> The presence of number 28 suggests natural prosperity potential, requiring balance between material and spiritual growth.
                                  </p>
                                )}
                                {[result.lifePath, result.destiny, result.expression, result.heartDesire].includes(8) && (
                                  <p className="text-sm">
                                    <span className="font-medium">Karmic Influence:</span> The presence of number 8 indicates strong karmic ties - both positive and negative actions will return with amplified force.
                                  </p>
                                )}
                              </div>
                            </div>
                            <div>
                              <h5 className="font-medium text-primary">Numerological Dynamics</h5>
                              <div className="mt-2 space-y-2">
                                <p className="text-sm">
                                  <span className="font-medium">Primary Challenge:</span> The interaction between your Life Path {result.lifePath} and Expression {result.expression} numbers {result.lifePath === result.expression ? "shows natural alignment" : "creates a dynamic tension"} that influences your personal growth.
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Soul Purpose:</span> Your Destiny {result.destiny} and Heart's Desire {result.heartDesire} numbers {result.destiny === result.heartDesire ? "are harmoniously aligned" : "create an interesting interplay"} between your life goals and inner wishes.
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Growth Path:</span> The combination of your Birth Date {result.birthDateNum} and Attribute {result.attribute} numbers suggests a natural inclination toward {result.birthDateNum === result.attribute ? "focused development" : "diverse growth opportunities"}.
                                </p>
                              </div>
                            </div>
                            <div>
                              <h5 className="font-medium text-primary">Key Behavioral Traits</h5>
                              <div className="mt-2 space-y-2">
                                {result.lifePath === 1 && (
                                  <p className="text-sm">⚠️ Strong desire for recognition - must balance ego and leadership.</p>
                                )}
                                {result.lifePath === 3 && (
                                  <p className="text-sm">⚠️ Tendency to challenge rules - maintain awareness of legal boundaries.</p>
                                )}
                                {result.lifePath === 4 && (
                                  <p className="text-sm">✅ Natural respect for law and order - use this for stable growth.</p>
                                )}
                                {result.lifePath === 5 && (
                                  <p className="text-sm">⚠️ Watch for addictive tendencies - maintain balance in pursuits.</p>
                                )}
                                {result.lifePath === 7 && (
                                  <p className="text-sm">⚠️ Intellectual pride - practice humility with your wisdom.</p>
                                )}
                                {result.lifePath === 9 && (
                                  <p className="text-sm">💫 Mirror-like adaptability - reflect and absorb energies mindfully.</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </motion.div>

            {/* Additional components with consistent styling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-6"
            >
              <DevelopmentRecommendations
                recommendations={result.recommendations}
                summary={result.interpretations.developmentSummary}
              />
              <CosmicEnergyMeter result={result} />
              <NumerologyJournal result={result} />
              <NumerologySoundtrack result={result} />
              <KarmaLeaderboard result={result} />
              <AICoach result={result} />
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}