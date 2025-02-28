import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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

export function ResultsBackground() {
  const [stars, setStars] = useState<Star[]>([]);
  const [lines, setLines] = useState<Line[]>([]);

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
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Animated gradient background */}
        <defs>
          <radialGradient id="star-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
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
            stroke="currentColor"
            strokeWidth="0.15"
            className="text-primary/30"
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
              className="fill-primary/40"
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
              className="text-primary"
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
              className="fill-primary/20"
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