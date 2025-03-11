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
  mode?: 'intense' | 'light';
}

export default function ConstellationBackground({ className = "", mode = 'intense' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<Star[]>([]);
  const numStars = mode === 'intense' ? 50 : 20; // Fewer stars in light mode

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    // Generate initial stars with adjusted parameters based on mode
    starsRef.current = Array.from({ length: numStars }).map(() => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      size: Math.random() * (mode === 'intense' ? 8 : 3) + (mode === 'intense' ? 4 : 2),
      opacity: Math.random() * (mode === 'intense' ? 0.9 : 0.7) + (mode === 'intense' ? 0.6 : 0.3),
      speed: Math.random() * (mode === 'intense' ? 2 : 1) + (mode === 'intense' ? 0.8 : 0.3)
    }));

    // Animation function
    let animationFrameId: number;
    const animate = () => {
      starsRef.current = starsRef.current.map(star => ({
        ...star,
        y: star.y - star.speed,
        opacity: star.y < 0 ? Math.random() * (mode === 'intense' ? 0.9 : 0.7) + (mode === 'intense' ? 0.6 : 0.3) : star.opacity
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
  }, [mode]);

  const generateSVG = (stars: Star[], width: number, height: number) => {
    const connections = generateConnections(stars);

    const glowIntensity = mode === 'intense' ? 6 : 2;
    const particleCount = mode === 'intense' ? 60 : 15;

    return `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="starGradient">
            <stop offset="0%" stop-color="var(--primary)" stop-opacity="${mode === 'intense' ? '1' : '0.7'}" />
            <stop offset="100%" stop-color="var(--primary)" stop-opacity="0" />
          </radialGradient>
          <linearGradient id="lineGradient">
            <stop offset="0%" stop-color="var(--primary)" stop-opacity="${mode === 'intense' ? '0.8' : '0.4'}" />
            <stop offset="50%" stop-color="var(--primary)" stop-opacity="${mode === 'intense' ? '0.4' : '0.2'}" />
            <stop offset="100%" stop-color="var(--primary)" stop-opacity="${mode === 'intense' ? '0.8' : '0.4'}" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="${glowIntensity}" result="coloredBlur"/> 
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          ${mode === 'intense' ? `
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="ultraGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="40" result="blur" />
            <feColorMatrix in="blur" type="saturate" values="2" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          ` : ''}
        </defs>

        ${mode === 'intense' ? `
        <!-- Background particle effect -->
        ${Array.from({ length: particleCount }).map((_, i) => `
          <circle
            cx="${Math.random() * width}"
            cy="${Math.random() * height}"
            r="${Math.random() * 150 + 50}"
            fill="var(--primary)"
            opacity="0.08"
            filter="url(#softGlow)"
          >
            <animate
              attributeName="opacity"
              values="0.08;0.2;0.08"
              dur="${8 + Math.random() * 8}s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values="${Math.random() * 150 + 50};${Math.random() * 200 + 100};${Math.random() * 150 + 50}"
              dur="${12 + Math.random() * 6}s"
              repeatCount="indefinite"
            />
          </circle>
        `).join('')}
        ` : ''}

        <!-- Connection lines -->
        ${connections.map(([star1, star2]) => `
          <path 
            d="M ${star1.x} ${star1.y} L ${star2.x} ${star2.y}"
            stroke="url(#lineGradient)"
            stroke-width="${mode === 'intense' ? '3' : '1'}"
            stroke-dasharray="${mode === 'intense' ? '12,12' : '4,4'}"
            class="animate-pulse"
            filter="url(#glow)"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0;${mode === 'intense' ? '24' : '8'}"
              dur="${mode === 'intense' ? '2s' : '3s'}"
              repeatCount="indefinite"
            />
          </path>
        `).join('')}

        <!-- Star effects -->
        ${stars.map(star => `
          <g class="animate-sparkle" filter="url(#${mode === 'intense' ? 'ultraGlow' : 'glow'})">
            <circle 
              cx="${star.x}" 
              cy="${star.y}" 
              r="${star.size}"
              fill="var(--primary)"
              opacity="${star.opacity}"
            >
              <animate 
                attributeName="opacity"
                values="${star.opacity};${star.opacity * (mode === 'intense' ? 4 : 2)};${star.opacity}"
                dur="${mode === 'intense' ? '1.5' : '2.5'}s"
                repeatCount="indefinite"
              />
            </circle>

            <circle 
              cx="${star.x}" 
              cy="${star.y}" 
              r="${star.size * (mode === 'intense' ? 8 : 4)}"
              fill="url(#starGradient)"
              opacity="${star.opacity * (mode === 'intense' ? 0.8 : 0.4)}"
            >
              <animate 
                attributeName="r"
                values="${star.size * (mode === 'intense' ? 8 : 4)};${star.size * (mode === 'intense' ? 12 : 6)};${star.size * (mode === 'intense' ? 8 : 4)}"
                dur="${mode === 'intense' ? '2' : '3'}s"
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
    const maxDistance = mode === 'intense' ? 250 : 150;

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
      transition={{ duration: mode === 'intense' ? 3 : 2 }}
    />
  );
}