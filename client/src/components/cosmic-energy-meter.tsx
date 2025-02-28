import { useState } from "react";
import { motion } from "framer-motion";
import type { NumerologyResult } from "@shared/schema";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  result: NumerologyResult;
}

const ENERGY_ASPECTS = {
  spiritual: {
    label: "Spiritual Energy",
    description: "Connection to higher consciousness and spiritual awareness",
    color: "from-violet-500 to-purple-600",
    numberMapping: ["lifePath", "destiny"]
  },
  mental: {
    label: "Mental Energy",
    description: "Intellectual capacity and thought processes",
    color: "from-blue-500 to-cyan-500",
    numberMapping: ["expression", "personality"]
  },
  emotional: {
    label: "Emotional Energy",
    description: "Emotional intelligence and relationship harmony",
    color: "from-pink-500 to-rose-500",
    numberMapping: ["heartDesire", "personality"]
  },
  physical: {
    label: "Physical Energy",
    description: "Material manifestation and physical vitality",
    color: "from-green-500 to-emerald-600",
    numberMapping: ["birthDateNum", "attribute"]
  }
};

export function CosmicEnergyMeter({ result }: Props) {
  const [selectedAspect, setSelectedAspect] = useState<string | null>(null);

  const calculateEnergyLevel = (aspect: keyof typeof ENERGY_ASPECTS) => {
    const numbers = ENERGY_ASPECTS[aspect].numberMapping.map(key => result[key as keyof NumerologyResult]);
    // Calculate average and normalize to 0-100 range
    const avg = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    return Math.min(100, Math.max(0, (avg / 11) * 100)); // 11 is highest master number
  };

  return (
    <div className="relative p-6 rounded-xl bg-background/80 backdrop-blur-sm border">
      <h3 className="text-xl font-semibold mb-6 text-center">Cosmic Energy Meter</h3>
      
      <div className="relative aspect-square">
        {/* Circular background with animated particles */}
        <div className="absolute inset-0 rounded-full bg-background/50 border-2 border-primary/20">
          <div className="absolute inset-0 animate-spin-slow opacity-20">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-primary/50"
                style={{
                  top: `${50 + 45 * Math.cos((i * Math.PI * 2) / 12)}%`,
                  left: `${50 + 45 * Math.sin((i * Math.PI * 2) / 12)}%`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Energy Beams */}
        <div className="absolute inset-0 flex items-center justify-center">
          {Object.entries(ENERGY_ASPECTS).map(([key, aspect], index) => {
            const rotation = (index * 360) / Object.keys(ENERGY_ASPECTS).length;
            const energyLevel = calculateEnergyLevel(key as keyof typeof ENERGY_ASPECTS);
            
            return (
              <TooltipProvider key={key}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      className={cn(
                        "absolute h-1 origin-left rounded-full cursor-pointer",
                        `bg-gradient-to-r ${aspect.color}`,
                        selectedAspect && selectedAspect !== key && "opacity-30"
                      )}
                      style={{
                        width: "45%",
                        transform: `rotate(${rotation}deg) scaleX(${energyLevel / 100})`,
                      }}
                      whileHover={{ scale: 1.1 }}
                      onClick={() => setSelectedAspect(selectedAspect === key ? null : key)}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-sm">
                    <p className="font-medium">{aspect.label}</p>
                    <p className="text-muted-foreground">{aspect.description}</p>
                    <p className="mt-1 font-mono">Energy Level: {Math.round(energyLevel)}%</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>

        {/* Center Point */}
        <motion.div 
          className="absolute top-1/2 left-1/2 w-4 h-4 -mt-2 -ml-2 rounded-full bg-gradient-to-br from-primary to-primary/50"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Details Section */}
      <div className="mt-6 space-y-2">
        {selectedAspect && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-primary/5"
          >
            <h4 className="font-medium">{ENERGY_ASPECTS[selectedAspect as keyof typeof ENERGY_ASPECTS].label}</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {ENERGY_ASPECTS[selectedAspect as keyof typeof ENERGY_ASPECTS].description}
            </p>
            <div className="mt-2 text-sm">
              <span className="font-mono">
                Energy Level: {Math.round(calculateEnergyLevel(selectedAspect as keyof typeof ENERGY_ASPECTS))}%
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
