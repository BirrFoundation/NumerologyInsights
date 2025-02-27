import React, { useEffect, useRef } from "react";
import type { NumerologyResult } from "@shared/schema";

interface Props {
  result: NumerologyResult;
}

export default function DNAVisualization({ result }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Calculate pattern parameters based on numerology numbers
    const lifePath = result.lifePath;
    const destiny = result.destiny;
    const expression = result.expression;
    const attribute = result.attribute;

    // Generate DNA strands
    const width = 800;
    const height = 400;
    const numStrands = 20;
    const strandGap = width / numStrands;

    // Clear previous content
    svgRef.current.innerHTML = '';

    // Create DNA helix patterns
    for (let i = 0; i < numStrands; i++) {
      const x = i * strandGap;
      const wave1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const wave2 = document.createElementNS("http://www.w3.org/2000/svg", "path");

      // Generate wave paths with numerology influence
      const amplitude = 50 + (lifePath * 2);
      const frequency = 0.02 + (destiny * 0.001);
      const phase = i * (expression * 0.1);

      let path1 = `M ${x} 0`;
      let path2 = `M ${x} ${height}`;

      for (let y = 0; y <= height; y += 10) {
        const offset = Math.sin(y * frequency + phase) * amplitude;
        path1 += ` L ${x + offset} ${y}`;
        path2 += ` L ${x + offset} ${height - y}`;
      }

      // Style based on numerology numbers
      const hue = (attribute * 30) % 360;
      const baseColor = `hsl(${hue}, 80%, 50%)`;
      const complementColor = `hsl(${(hue + 180) % 360}, 80%, 50%)`;

      wave1.setAttribute("d", path1);
      wave1.setAttribute("stroke", baseColor);
      wave1.setAttribute("stroke-width", "2");
      wave1.setAttribute("fill", "none");
      wave1.setAttribute("class", "animate-dna");

      wave2.setAttribute("d", path2);
      wave2.setAttribute("stroke", complementColor);
      wave2.setAttribute("stroke-width", "2");
      wave2.setAttribute("fill", "none");
      wave2.setAttribute("class", "animate-dna");

      // Add connecting nodes at intersections
      for (let y = 0; y <= height; y += 50) {
        const node = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        const offset = Math.sin(y * frequency + phase) * amplitude;

        node.setAttribute("cx", `${x + offset}`);
        node.setAttribute("cy", `${y}`);
        node.setAttribute("r", "3");
        node.setAttribute("fill", baseColor);
        node.setAttribute("class", "animate-pulse");

        svgRef.current.appendChild(node);
      }

      svgRef.current.appendChild(wave1);
      svgRef.current.appendChild(wave2);
    }
  }, [result]);

  return (
    <div className="w-full overflow-hidden rounded-lg bg-background/30 backdrop-blur-sm p-4">
      <h3 className="text-xl font-semibold mb-4 text-center">Your Numerological DNA Pattern</h3>
      <div className="relative w-full aspect-[2/1] flex items-center justify-center">
        <svg
          ref={svgRef}
          className="w-full h-full"
          viewBox="0 0 800 400"
          preserveAspectRatio="xMidYMid meet"
        />
      </div>
      <p className="text-sm text-muted-foreground text-center mt-4">
        This visualization represents your unique numerological DNA pattern, influenced by your Life Path ({result.lifePath}), 
        Destiny ({result.destiny}), Expression ({result.expression}), and Attribute ({result.attribute}) numbers.
      </p>
    </div>
  );
}