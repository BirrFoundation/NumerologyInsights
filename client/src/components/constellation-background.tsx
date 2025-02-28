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
      size: Math.random() * 5 + 3, // Increased base star size
      opacity: Math.random() * 0.9 + 0.4, // Increased opacity range
      speed: Math.random() * 1.5 + 0.5 // Increased movement speed
    }));

    // Animation function
    let animationFrameId: number;
    const animate = () => {
      starsRef.current = starsRef.current.map(star => ({
        ...star,
        y: star.y - star.speed,
        opacity: star.y < 0 ? Math.random() * 0.9 + 0.4 : star.opacity
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
            <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.9" />
            <stop offset="100%" stop-color="var(--primary)" stop-opacity="0" />
          </radialGradient>
          <linearGradient id="lineGradient">
            <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.6" />
            <stop offset="50%" stop-color="var(--primary)" stop-opacity="0.3" />
            <stop offset="100%" stop-color="var(--primary)" stop-opacity="0.6" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/> 
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Background particle effect -->
        ${Array.from({ length: 40 }).map((_, i) => `
          <circle
            cx="${Math.random() * width}"
            cy="${Math.random() * height}"
            r="${Math.random() * 100 + 40}"
            fill="var(--primary)"
            opacity="0.05"
            filter="url(#softGlow)"
          >
            <animate
              attributeName="opacity"
              values="0.05;0.15;0.05"
              dur="${7 + Math.random() * 7}s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values="${Math.random() * 100 + 40};${Math.random() * 150 + 60};${Math.random() * 100 + 40}"
              dur="${10 + Math.random() * 5}s"
              repeatCount="indefinite"
            />
          </circle>
        `).join('')}

        <!-- Connection lines with enhanced effects -->
        ${connections.map(([star1, star2]) => `
          <path 
            d="M ${star1.x} ${star1.y} L ${star2.x} ${star2.y}"
            stroke="url(#lineGradient)"
            stroke-width="2.5"
            stroke-dasharray="10,10"
            class="animate-pulse"
            filter="url(#glow)"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0;20"
              dur="3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-opacity"
              values="0.6;1;0.6"
              dur="4s"
              repeatCount="indefinite"
            />
          </path>
        `).join('')}

        <!-- Enhanced star effects -->
        ${stars.map(star => `
          <g class="animate-sparkle" filter="url(#glow)">
            <!-- Main star -->
            <circle 
              cx="${star.x}" 
              cy="${star.y}" 
              r="${star.size}"
              fill="var(--primary)"
              opacity="${star.opacity}"
            >
              <animate 
                attributeName="opacity"
                values="${star.opacity};${star.opacity * 3};${star.opacity}"
                dur="${2 + Math.random() * 2}s"
                repeatCount="indefinite"
              />
            </circle>

            <!-- Outer glow -->
            <circle 
              cx="${star.x}" 
              cy="${star.y}" 
              r="${star.size * 6}"
              fill="url(#starGradient)"
              opacity="${star.opacity * 0.7}"
            >
              <animate 
                attributeName="r"
                values="${star.size * 6};${star.size * 10};${star.size * 6}"
                dur="${3 + Math.random() * 2}s"
                repeatCount="indefinite"
              />
            </circle>

            <!-- Pulse effect -->
            <circle 
              cx="${star.x}" 
              cy="${star.y}" 
              r="${star.size * 4}"
              fill="none"
              stroke="var(--primary)"
              stroke-width="1"
              opacity="${star.opacity * 0.5}"
            >
              <animate 
                attributeName="r"
                values="${star.size * 4};${star.size * 15};${star.size * 4}"
                dur="${4 + Math.random() * 3}s"
                repeatCount="indefinite"
              />
              <animate 
                attributeName="opacity"
                values="${star.opacity * 0.5};0;${star.opacity * 0.5}"
                dur="${4 + Math.random() * 3}s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        `).join('')}
      </svg>
    `;
  };

  const generateConnections = (stars: Star[]) => {
    const connections: [Star, Star][] = [];
    const maxDistance = 200; 

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
      className={`absolute inset-0 overflow-hidden bg-cosmic ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2.5 }}
    />
  );
}