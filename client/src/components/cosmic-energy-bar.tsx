import * as React from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Sparkles } from "lucide-react";

interface CosmicEnergyBarProps {
  value: number;
  maxValue?: number;
  label?: string;
  className?: string;
}

export function CosmicEnergyBar({
  value,
  maxValue = 100,
  label = "Cosmic Energy",
  className = ""
}: CosmicEnergyBarProps) {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    // Animate progress to target value
    setProgress(Math.min((value / maxValue) * 100, 100));
  }, [value, maxValue]);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-sm text-muted-foreground">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="relative">
        <Progress value={progress} className="h-3 bg-primary/10" />
        <motion.div
          className="absolute top-0 left-0 h-full w-full overflow-hidden rounded-full opacity-50"
          style={{
            background: "linear-gradient(90deg, transparent, var(--primary), transparent)",
            width: "50%",
          }}
          animate={{
            x: ["-100%", "200%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </div>
  );
}
