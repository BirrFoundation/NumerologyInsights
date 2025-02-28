import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Point {
  x: number;
  y: number;
  size: number;
  delay: number;
}

interface Props {
  message?: string;
  className?: string;
}

export function ConstellationLoading({ message = "Loading...", className = "" }: Props) {
  const [points, setPoints] = useState<Point[]>([]);
  const [lines, setLines] = useState<[Point, Point][]>([]);

  useEffect(() => {
    // Generate random constellation points
    const newPoints: Point[] = Array.from({ length: 12 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: i * 0.1
    }));

    // Connect points to form constellation lines
    const newLines: [Point, Point][] = [];
    for (let i = 0; i < newPoints.length - 1; i++) {
      if (Math.random() > 0.3) { // 70% chance to connect points
        newLines.push([newPoints[i], newPoints[i + 1]]);
      }
    }

    setPoints(newPoints);
    setLines(newLines);
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div className="relative w-48 h-48 mb-4">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Draw constellation lines */}
          {lines.map(([start, end], i) => (
            <motion.line
              key={`line-${i}`}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke="currentColor"
              strokeWidth="0.2"
              className="text-primary/30"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 1.5,
                delay: Math.min(start.delay, end.delay),
                ease: "easeInOut"
              }}
            />
          ))}
          
          {/* Draw stars */}
          {points.map((point, i) => (
            <motion.circle
              key={`point-${i}`}
              cx={point.x}
              cy={point.y}
              r={point.size}
              className="fill-primary"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1.2, 1],
                opacity: 1
              }}
              transition={{
                duration: 0.5,
                delay: point.delay,
                ease: "easeOut"
              }}
            >
              {/* Add twinkling animation */}
              <animate
                attributeName="opacity"
                values="1;0.5;1"
                dur={`${2 + Math.random()}s`}
                repeatCount="indefinite"
              />
            </motion.circle>
          ))}
        </svg>
      </div>
      
      {/* Loading text with fade-in animation */}
      <motion.p
        className="text-primary/80 text-lg font-light"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {message}
      </motion.p>
    </div>
  );
}
