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

interface Props {
  result: NumerologyResult;
}

export function ResultsBackground({ result }: Props) {
  const [stars, setStars] = useState<Star[]>([]);
  const [lines, setLines] = useState<Line[]>([]);

  useEffect(() => {
    // Generate stars across the entire viewport
    const newStars = Array.from({ length: 100 }, (_, i) => ({
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
    <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden">
      {/* Glowing background effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at center, hsl(var(--background)) 0%, hsl(var(--primary) / 0.4) 20%, hsl(var(--primary) / 0.2) 40%, hsl(var(--background)) 100%)",
          backgroundSize: "400% 400%"
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <svg className="w-full h-full absolute" viewBox="0 0 100 100">
        {/* Define glow effect */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Constellation lines */}
        {lines.map((line, i) => (
          <motion.line
            key={`line-${i}`}
            x1={line.start.x}
            y1={line.start.y}
            x2={line.end.x}
            y2={line.end.y}
            stroke="currentColor"
            strokeWidth="0.1"
            className="text-primary/10"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: [line.opacity * 0.3, line.opacity * 0.6, line.opacity * 0.3] 
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
              className="fill-primary/30"
              filter="url(#glow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.7, 0.3] 
              }}
              transition={{
                duration: 2 + Math.random(),
                delay: star.delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Star sparkle */}
            <motion.circle
              cx={star.x}
              cy={star.y}
              r={star.size * 2}
              className="fill-primary/10"
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