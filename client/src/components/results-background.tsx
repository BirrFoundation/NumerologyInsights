import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { NumerologyResult } from "@shared/schema";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  color: number; // For varying star colors
}

interface Props {
  result: NumerologyResult;
}

export function ResultsBackground({ result }: Props) {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Generate stars with different sizes and colors
    const newStars = Array.from({ length: 200 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.2 + 0.3,
      delay: i * 0.02,
      color: Math.random() * 60 - 30 // Varies hue by ±30 degrees
    }));

    setStars(newStars);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-background/95" />

      <svg className="w-full h-full absolute" viewBox="0 0 100 100">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Stars */}
        <g>
          {stars.map((star) => (
            <g key={star.id}>
              {/* Core star */}
              <motion.circle
                cx={star.x}
                cy={star.y}
                r={star.size}
                style={{
                  fill: `hsl(calc(var(--primary-hue) + ${star.color}) calc(var(--primary-saturation) * 1%) calc(var(--primary-lightness) * 1%))`,
                }}
                className="opacity-40"
                filter="url(#glow)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3] 
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: star.delay,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Sparkle */}
              <motion.g
                initial={{ rotate: 0, scale: 0 }}
                animate={{
                  rotate: 360,
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
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
                    stroke={`hsl(calc(var(--primary-hue) + ${star.color}) calc(var(--primary-saturation) * 1%) calc(var(--primary-lightness) * 1%))`}
                    strokeWidth="0.1"
                    className="opacity-20"
                  />
                ))}
              </motion.g>

              {/* Pulse effect */}
              <motion.circle
                cx={star.x}
                cy={star.y}
                r={star.size * 3}
                style={{
                  fill: `hsl(calc(var(--primary-hue) + ${star.color}) calc(var(--primary-saturation) * 1%) calc(var(--primary-lightness) * 1%))`,
                }}
                className="opacity-10"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [1, 2, 1],
                  opacity: [0, 0.2, 0] 
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
        </g>
      </svg>
    </div>
  );
}