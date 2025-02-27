import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
}

interface Props {
  className?: string;
}

export default function ConstellationBackground({ className = "" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<Star[]>([]);
  const numStars = 50;

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    // Generate initial stars
    starsRef.current = Array.from({ length: numStars }).map(() => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3,
      speed: Math.random() * 0.5 + 0.2
    }));

    // Animation function
    let animationFrameId: number;
    const animate = () => {
      starsRef.current = starsRef.current.map(star => ({
        ...star,
        y: star.y - star.speed,
        opacity: star.y < 0 ? Math.random() * 0.5 + 0.3 : star.opacity
      }));

      if (container) {
        container.innerHTML = generateSVG(starsRef.current, rect.width, rect.height);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const generateSVG = (stars: Star[], width: number, height: number) => {
    const connections = generateConnections(stars);
    
    return `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="starGradient">
            <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.4" />
            <stop offset="100%" stop-color="var(--primary)" stop-opacity="0" />
          </radialGradient>
        </defs>
        
        ${connections.map(([star1, star2]) => `
          <line 
            x1="${star1.x}" 
            y1="${star1.y}" 
            x2="${star2.x}" 
            y2="${star2.y}"
            stroke="var(--primary)"
            stroke-width="0.5"
            stroke-opacity="0.2"
          />
        `).join('')}
        
        ${stars.map(star => `
          <circle 
            cx="${star.x}" 
            cy="${star.y}" 
            r="${star.size}"
            fill="var(--primary)"
            opacity="${star.opacity}"
          >
            <animate 
              attributeName="opacity"
              values="${star.opacity};${star.opacity * 1.5};${star.opacity}"
              dur="${2 + Math.random() * 2}s"
              repeatCount="indefinite"
            />
          </circle>
          <circle 
            cx="${star.x}" 
            cy="${star.y}" 
            r="${star.size * 2}"
            fill="url(#starGradient)"
            opacity="${star.opacity * 0.5}"
          />
        `).join('')}
      </svg>
    `;
  };

  const generateConnections = (stars: Star[]) => {
    const connections: [Star, Star][] = [];
    const maxDistance = 100;

    stars.forEach((star1, i) => {
      stars.slice(i + 1).forEach(star2 => {
        const distance = Math.sqrt(
          Math.pow(star1.x - star2.x, 2) + Math.pow(star1.y - star2.y, 2)
        );
        if (distance < maxDistance) {
          connections.push([star1, star2]);
        }
      });
    });

    return connections;
  };

  return (
    <motion.div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  );
}
