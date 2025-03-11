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
}

interface Props {
  result: NumerologyResult;
}

export function ResultsBackground({ result }: Props) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    // Generate subtle bubbles with different sizes and colors
    const newBubbles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 0.8 + 0.2, // Smaller sizes for subtlety
      delay: i * 0.05,
      color: Math.random() * 30 - 15 // Subtle color variations
    }));

    setBubbles(newBubbles);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-background/98" /> {/* More opaque background */}

      <svg className="w-full h-full absolute" viewBox="0 0 100 100">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/> {/* Reduced blur */}
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <g>
          {bubbles.map((bubble) => (
            <g key={bubble.id}>
              {/* Core bubble */}
              <motion.circle
                cx={bubble.x}
                cy={bubble.y}
                r={bubble.size}
                style={{
                  fill: `hsl(calc(var(--primary-hue) + ${bubble.color}) calc(var(--primary-saturation) * 1%) calc(var(--primary-lightness) * 1%))`,
                }}
                className="opacity-20" // Reduced opacity
                filter="url(#glow)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.1, 0.2, 0.1] 
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  delay: bubble.delay,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Subtle pulse effect */}
              <motion.circle
                cx={bubble.x}
                cy={bubble.y}
                r={bubble.size * 2}
                style={{
                  fill: `hsl(calc(var(--primary-hue) + ${bubble.color}) calc(var(--primary-saturation) * 1%) calc(var(--primary-lightness) * 1%))`,
                }}
                className="opacity-5" // Very subtle
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0, 0.1, 0] 
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
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