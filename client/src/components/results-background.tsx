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
    // Generate stars in a more balanced pattern
    const newStars = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: 20 + Math.random() * 60, // Keep stars more centered
      y: Math.random() * 100,
      size: Math.random() * 1.2 + 0.3, // Even smaller for more delicate effect
      delay: i * 0.15
    }));

    // Create more natural constellation patterns
    const newLines: Line[] = [];
    for (let i = 0; i < newStars.length; i++) {
      for (let j = i + 1; j < newStars.length; j++) {
        const distance = Math.hypot(newStars[i].x - newStars[j].x, newStars[i].y - newStars[j].y);
        if (distance < 15) { // Shorter connections for more delicate patterns
          newLines.push({
            start: newStars[i],
            end: newStars[j],
            opacity: (1 - distance / 15) * 0.2 // Even more subtle lines
          });
        }
      }
    }

    setStars(newStars);
    setLines(newLines);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Constellation lines */}
        {lines.map((line, i) => (
          <motion.line
            key={`line-${i}`}
            x1={line.start.x}
            y1={line.start.y}
            x2={line.end.x}
            y2={line.end.y}
            stroke="currentColor"
            strokeWidth="0.08" // Thinner lines
            className="text-primary/5" // More subtle opacity
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: [line.opacity * 0.2, line.opacity * 0.4, line.opacity * 0.2] 
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
              className="fill-primary/20"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2] 
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
              className="fill-primary/5"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [1.2, 1.8, 1.2],
                opacity: [0.05, 0.1, 0.05] 
              }}
              transition={{
                duration: 3 + Math.random(),
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