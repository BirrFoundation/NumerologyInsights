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
  opacity: number;
}

interface Props {
  result: NumerologyResult;
}

export function ResultsBackground({ result }: Props) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    // Generate more dynamic and beautiful bubbles
    const newBubbles = Array.from({ length: 1 }, (_, i) => ({
      id: i,
      x: Math.random() * 1,
      y: Math.random() * 1,
      size: Math.random() * 3 + 0.5, // Larger size range for more variety
      delay: i * 0.02, // Faster initial appearance
      color: Math.random() * 60 - 30, // Wider color range for more variation
      duration: 5 + Math.random() * 4, // Longer animation duration
      opacity: 0.1 + Math.random() * 0.2 // Variable opacity
    }));

    setBubbles(newBubbles);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-primary/5" />

      <svg className="w-full h-full absolute" viewBox="0 0 100 100">
        <defs>
          <radialGradient id="bubbleGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </radialGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feComposite in="SourceGraphic" in2="coloredBlur" operator="over" />
          </filter>

          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="glow" />
            <feComposite in="SourceGraphic" in2="glow" operator="over" />
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
                  opacity: [bubble.opacity, bubble.opacity * 1.5, bubble.opacity]
                }}
                transition={{
                  duration: bubble.duration,
                  delay: bubble.delay,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Enhanced glow effect */}
              <motion.circle
                cx={bubble.x}
                cy={bubble.y}
                r={bubble.size * 3}
                fill="url(#bubbleGradient)"
                filter="url(#softGlow)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0, bubble.opacity * 0.8, 0]
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