import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { NumerologyResult } from "@shared/schema";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

interface Line {
  start: Star;
  end: Star;
  opacity: number;
}

// Calculate mood colors based on numerology numbers
function calculateMoodColors(result: NumerologyResult) {
  // Life Path influences primary color
  const lifePath = result.lifePath;
  const baseHue = (lifePath * 30) % 360; // Spread colors across spectrum

  // Destiny number influences intensity
  const destiny = result.destiny;
  const intensity = 0.3 + (destiny / 11) * 0.4; // Scale 0.3-0.7

  // Expression number influences secondary color
  const expression = result.expression;
  const secondaryHue = ((baseHue + 180 + expression * 20) % 360);

  return {
    primary: `hsl(${baseHue}, 70%, ${intensity * 100}%)`,
    secondary: `hsl(${secondaryHue}, 60%, ${(intensity * 0.8) * 100}%)`,
    accent: `hsl(${(baseHue + 120) % 360}, 80%, ${(intensity * 0.9) * 100}%)`
  };
}

interface Props {
  result: NumerologyResult;
}

export function ResultsBackground({ result }: Props) {
  const [stars, setStars] = useState<Star[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const colors = calculateMoodColors(result);

  useEffect(() => {
    // Generate stars across the entire viewport
    const newStars = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      delay: i * 0.1
    }));

    // Create constellation patterns
    const newLines: Line[] = [];
    for (let i = 0; i < newStars.length; i++) {
      for (let j = i + 1; j < newStars.length; j++) {
        const distance = Math.hypot(newStars[i].x - newStars[j].x, newStars[i].y - newStars[j].y);
        if (distance < 25) {
          newLines.push({
            start: newStars[i],
            end: newStars[j],
            opacity: (1 - distance / 25) * 0.5
          });
        }
      }
    }

    setStars(newStars);
    setLines(newLines);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            `radial-gradient(circle at 30% 30%, ${colors.primary}, transparent 60%),
             radial-gradient(circle at 70% 70%, ${colors.secondary}, transparent 60%),
             radial-gradient(circle at 50% 50%, ${colors.accent}, transparent 60%)`,
            `radial-gradient(circle at 70% 30%, ${colors.secondary}, transparent 60%),
             radial-gradient(circle at 30% 70%, ${colors.primary}, transparent 60%),
             radial-gradient(circle at 50% 50%, ${colors.accent}, transparent 60%)`
          ]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear"
        }}
      />

      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Define gradient for star glow */}
        <defs>
          <radialGradient id="star-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={colors.primary} stopOpacity="0.3" />
            <stop offset="100%" stopColor={colors.primary} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Constellation lines */}
        {lines.map((line, i) => (
          <motion.line
            key={`line-${i}`}
            x1={line.start.x}
            y1={line.start.y}
            x2={line.end.x}
            y2={line.end.y}
            stroke={colors.primary}
            strokeWidth="0.15"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: [line.opacity * 0.5, line.opacity, line.opacity * 0.5] 
            }}
            transition={{
              pathLength: {
                duration: 2,
                delay: Math.min(line.start.delay, line.end.delay)
              },
              opacity: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          />
        ))}

        {/* Stars */}
        {stars.map((star) => (
          <g key={star.id}>
            {/* Star core */}
            <motion.circle
              cx={star.x}
              cy={star.y}
              r={star.size}
              fill={colors.primary}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.8, 0.4] 
              }}
              transition={{
                duration: 2 + Math.random(),
                delay: star.delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Star glow */}
            <motion.circle
              cx={star.x}
              cy={star.y}
              r={star.size * 3}
              fill="url(#star-glow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [1.2, 1.8, 1.2],
                opacity: [0.3, 0.6, 0.3] 
              }}
              transition={{
                duration: 3 + Math.random(),
                delay: star.delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Sparkle effect */}
            <motion.circle
              cx={star.x}
              cy={star.y}
              r={star.size * 2}
              fill={colors.secondary}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [1, 2, 1],
                opacity: [0, 0.3, 0],
                rotate: [0, 180]
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                delay: star.delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}