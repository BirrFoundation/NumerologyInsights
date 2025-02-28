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
    // Generate constellation stars
    const newStars = Array.from({ length: 120 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      delay: i * 0.05
    }));

    // Create constellation patterns
    const newLines: Line[] = [];
    for (let i = 0; i < newStars.length; i++) {
      for (let j = i + 1; j < newStars.length; j++) {
        const distance = Math.hypot(newStars[i].x - newStars[j].x, newStars[i].y - newStars[j].y);
        if (distance < 15) {
          newLines.push({
            start: newStars[i],
            end: newStars[j],
            opacity: (1 - distance / 15) * 0.5
          });
        }
      }
    }

    setStars(newStars);
    setLines(newLines);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden">
      {/* Cosmic background effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, hsl(var(--primary) / 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, hsl(var(--primary) / 0.3) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, hsl(var(--background)) 0%, hsl(var(--primary) / 0.1) 100%)
          `,
          backgroundSize: "200% 200%"
        }}
        animate={{
          backgroundPosition: [
            "0% 0%",
            "100% 100%",
            "0% 100%",
            "100% 0%",
            "0% 0%"
          ]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <svg className="w-full h-full absolute" viewBox="0 0 100 100">
        <defs>
          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Star gradient */}
          <radialGradient id="starGlow">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="currentColor" stopOpacity="0"/>
          </radialGradient>
        </defs>

        {/* Constellation lines */}
        <g className="text-primary/10">
          {lines.map((line, i) => (
            <motion.line
              key={`line-${i}`}
              x1={line.start.x}
              y1={line.start.y}
              x2={line.end.x}
              y2={line.end.y}
              stroke="currentColor"
              strokeWidth="0.1"
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
        </g>

        {/* Stars */}
        <g className="text-primary">
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

              {/* Star glow */}
              <motion.circle
                cx={star.x}
                cy={star.y}
                r={star.size * 2}
                fill="url(#starGlow)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [1.2, 1.8, 1.2],
                  opacity: [0.2, 0.4, 0.2] 
                }}
                transition={{
                  duration: 3 + Math.random(),
                  delay: star.delay,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Sparkle effect */}
              <motion.g
                initial={{ rotate: 0, scale: 0 }}
                animate={{
                  rotate: 360,
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  delay: star.delay,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {[0, 45, 90, 135].map((angle) => (
                  <motion.line
                    key={angle}
                    x1={star.x}
                    y1={star.y}
                    x2={star.x + Math.cos(angle * Math.PI / 180) * star.size * 3}
                    y2={star.y + Math.sin(angle * Math.PI / 180) * star.size * 3}
                    stroke="currentColor"
                    strokeWidth="0.1"
                    className="text-primary/20"
                  />
                ))}
              </motion.g>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}