import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { NumerologyResult } from "@shared/schema";

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  color: number;
  duration: number;
}

interface Props {
  result: NumerologyResult;
}

export function ResultsBackground({ result }: Props) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    // Generate more bubbles with varying sizes and colors
    const newBubbles = Array.from({ length: 75 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5, // More varied sizes
      delay: i * 0.03, // Faster initial appearance
      color: Math.random() * 40 - 20, // Wider color range
      duration: 4 + Math.random() * 3 // Varied animation duration
    }));

    setBubbles(newBubbles);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-primary/5" />

      <svg className="w-full h-full absolute" viewBox="0 0 100 100">
        <defs>
          <radialGradient id="bubbleGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </radialGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="0.8" result="coloredBlur" />
            <feComposite in="SourceGraphic" in2="coloredBlur" operator="over" />
          </filter>
        </defs>

        <g>
          {bubbles.map((bubble) => (
            <g key={bubble.id}>
              {/* Main bubble */}
              <motion.circle
                cx={bubble.x}
                cy={bubble.y}
                r={bubble.size}
                style={{
                  fill: `hsl(calc(var(--primary-hue) + ${bubble.color}) calc(var(--primary-saturation) * 1%) calc(var(--primary-lightness) * 1%))`
                }}
                className="opacity-20"
                filter="url(#glow)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.3, 0.2] 
                }}
                transition={{
                  duration: bubble.duration,
                  delay: bubble.delay,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Subtle glow effect */}
              <motion.circle
                cx={bubble.x}
                cy={bubble.y}
                r={bubble.size * 3}
                fill="url(#bubbleGradient)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0, 0.15, 0] 
                }}
                transition={{
                  duration: bubble.duration * 1.5,
                  delay: bubble.delay,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}