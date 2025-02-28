import { useState } from "react";
import { motion } from "framer-motion";
import type { NumerologyResult } from "@shared/schema";
import { cn } from "@/lib/utils";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface Props {
  result: NumerologyResult;
}

const ENERGY_ASPECTS = {
  spiritual: {
    label: "Spiritual Energy",
    description: "Connection to higher consciousness and spiritual awareness",
    color: "hsl(267, 84%, 71%)",
    numberMapping: ["lifePath", "destiny"]
  },
  mental: {
    label: "Mental Energy",
    description: "Intellectual capacity and thought processes",
    color: "hsl(199, 89%, 48%)",
    numberMapping: ["expression", "personality"]
  },
  emotional: {
    label: "Emotional Energy",
    description: "Emotional intelligence and relationship harmony",
    color: "hsl(341, 90%, 67%)",
    numberMapping: ["heartDesire", "personality"]
  },
  physical: {
    label: "Physical Energy",
    description: "Material manifestation and physical vitality",
    color: "hsl(142, 71%, 45%)",
    numberMapping: ["birthDateNum", "attribute"]
  }
};

export function CosmicEnergyMeter({ result }: Props) {
  const [selectedAspect, setSelectedAspect] = useState<string | null>(null);

  const calculateEnergyLevel = (aspect: keyof typeof ENERGY_ASPECTS) => {
    const numbers = ENERGY_ASPECTS[aspect].numberMapping.map(key => result[key as keyof NumerologyResult]);
    const avg = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    return Math.min(100, Math.max(0, (avg / 11) * 100));
  };

  const chartData = Object.entries(ENERGY_ASPECTS).map(([key, aspect]) => ({
    aspect: aspect.label,
    value: calculateEnergyLevel(key as keyof typeof ENERGY_ASPECTS),
    description: aspect.description,
    color: aspect.color,
  }));

  const chartConfig = Object.fromEntries(
    Object.entries(ENERGY_ASPECTS).map(([key, aspect]) => [
      key,
      { color: aspect.color }
    ])
  );

  return (
    <div className="relative p-6 rounded-xl bg-background/80 backdrop-blur-sm border border-primary/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <h3 className="text-xl font-semibold text-center">Cosmic Energy Meter</h3>

        {/* Energy Chart */}
        <div className="relative aspect-square">
          {/* Animated Background Glow */}
          <div className="absolute inset-0 blur-2xl opacity-20">
            {chartData.map((data, index) => (
              <motion.div
                key={index}
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle at center, ${data.color} 0%, transparent 70%)`,
                  opacity: selectedAspect ? (data.aspect === selectedAspect ? 0.5 : 0.1) : 0.3,
                }}
                animate={{
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.5,
                }}
              />
            ))}
          </div>

          {/* Radar Chart */}
          <ChartContainer className="w-full h-full" config={chartConfig}>
            <RadarChart
              data={chartData}
              className="w-full h-full [&_.recharts-polar-grid-angle-line]:stroke-border/50 [&_.recharts-polar-grid-concentric]:stroke-border/30"
            >
              <PolarGrid />
              <PolarAngleAxis
                dataKey="aspect"
                tick={{
                  fill: "hsl(var(--foreground))",
                  fontSize: 12,
                }}
              />
              <Radar
                name="Energy Level"
                dataKey="value"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.3}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background/95 p-2 shadow-xl backdrop-blur-sm">
                      <p className="font-medium">{data.aspect}</p>
                      <p className="text-sm text-muted-foreground">{data.description}</p>
                      <p className="mt-1 font-mono text-sm">
                        Energy Level: {Math.round(data.value)}%
                      </p>
                    </div>
                  );
                }}
              />
            </RadarChart>
          </ChartContainer>
        </div>

        {/* Energy Breakdown */}
        <div className="grid grid-cols-2 gap-4">
          {chartData.map((data) => (
            <motion.div
              key={data.aspect}
              className={cn(
                "p-4 rounded-lg backdrop-blur-sm border cursor-pointer transition-colors",
                selectedAspect === data.aspect
                  ? "bg-primary/10 border-primary/30"
                  : "bg-background/50 border-border hover:bg-primary/5"
              )}
              onClick={() => setSelectedAspect(selectedAspect === data.aspect ? null : data.aspect)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: data.color }}
                />
                <h4 className="font-medium text-sm">{data.aspect}</h4>
              </div>
              <p className="text-2xl font-mono mt-2">
                {Math.round(data.value)}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {data.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}