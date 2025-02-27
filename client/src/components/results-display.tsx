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
import { motion, AnimatePresence } from "framer-motion";
import DevelopmentRecommendations from "./development-recommendations";
import DNAVisualization from "./dna-visualization";
import StrengthsWeaknessesChart from "./strengths-weaknesses-chart";

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
    strengths: ["Practical", "Reliable", "Systematic", "Organized", "Hardworking"],
    weaknesses: ["Rigid", "Stubborn", "Limited", "Too serious"]
  },
  5: {
    title: "The Freedom Explorer",
    strengths: ["Adventure-seeking", "Versatile", "Curious", "Dynamic", "Quick learner"],
    weaknesses: ["Addictive tendencies", "Restless", "Easily bored", "Commitment-phobic"]
  },
  6: {
    title: "The Nurturer",
    strengths: ["Responsible", "Loving", "Caring", "Protective", "Balanced"],
    weaknesses: ["Worried", "Anxious", "Interfering", "Self-sacrificing"]
  },
  7: {
    title: "The Seeker",
    strengths: ["Analytical", "Studious", "Introspective", "Perfectionist", "Wise"],
    weaknesses: ["Reserved", "Secretive", "Isolated", "Skeptical"]
  },
  8: {
    title: "The Powerhouse",
    strengths: ["Ambitious", "Confident", "Executive", "Goal-oriented", "Successful"],
    weaknesses: ["Materialistic", "Domineering", "Workaholic", "Stressed"]
  },
  9: {
    title: "The Adaptive Mirror",
    strengths: ["Extremely adaptable", "Mirror-like perception", "Empathetic", "Universal understanding", "Reflective"],
    weaknesses: ["Over-absorption of others", "Identity confusion", "Boundary issues", "Emotional overwhelm"]
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
  }
};

function NumberDisplay({ number, title }: { number: number; title: string }) {
  const meaning = NUMBER_MEANINGS[number as keyof typeof NUMBER_MEANINGS] || NUMBER_MEANINGS[number % 9 || 9];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-center p-4 rounded-lg bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors"
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
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light">
            {title}: {number} - {meaning.title}
          </DialogTitle>
          <DialogDescription>
            Click to explore the meaning and characteristics of this number
          </DialogDescription>
        </DialogHeader>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 py-4"
        >
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
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

export default function ResultsDisplay({ result, onReset }: Props) {
  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString();
  };

  function generateChartData(result: NumerologyResult) {
    const chartItems = [
      {
        label: "Leadership & Independence",
        value: Math.min(100, (result.lifePath === 1 || result.expression === 1) ? 90 :
          (result.lifePath === 8 || result.expression === 8) ? 85 : 70),
        type: "strength" as const
      },
      {
        label: "Creativity & Expression",
        value: Math.min(100, (result.lifePath === 3 || result.expression === 3) ? 90 :
          (result.heartDesire === 3) ? 85 : 65),
        type: "strength" as const
      },
      {
        label: "Analytical Thinking",
        value: Math.min(100, (result.lifePath === 7 || result.expression === 7) ? 90 :
          (result.personality === 7) ? 85 : 75),
        type: "strength" as const
      },
      {
        label: "Emotional Sensitivity",
        value: Math.min(100, (result.lifePath === 2 || result.heartDesire === 2) ? 85 :
          (result.personality === 2) ? 80 : 70),
        type: result.lifePath === 2 ? "strength" as const : "weakness" as const
      },
      {
        label: "Adaptability",
        value: Math.min(100, (result.lifePath === 9 || result.expression === 9) ? 90 :
          (result.lifePath === 5 || result.expression === 5) ? 85 : 70),
        type: "strength" as const
      },
      {
        label: "Focus & Discipline",
        value: Math.min(100, (result.lifePath === 4 || result.expression === 4) ? 85 :
          (result.personality === 4) ? 80 : 65),
        type: result.lifePath === 4 ? "strength" as const : "weakness" as const
      }
    ];

    return chartItems;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
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
        className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4"
      >
        <NumberDisplay number={result.lifePath} title="Life Path Number" />
        <NumberDisplay number={result.destiny} title="Destiny Number" />
        <NumberDisplay number={result.birthDateNum} title="Birth Date Number" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4"
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
          className="mb-8"
        >
          <h3 className="text-xl font-semibold mb-4">Personal Traits Analysis</h3>
          <StrengthsWeaknessesChart items={generateChartData(result)} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-xl font-semibold mb-4">Personal Development Path</h3>
          <DevelopmentRecommendations
            recommendations={result.interpretations.recommendations}
            summary={result.interpretations.developmentSummary}
          />
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <Button variant="outline" onClick={onReset} className="w-full">
          Calculate Another Reading
        </Button>
      </motion.div>
    </motion.div>
  );
}