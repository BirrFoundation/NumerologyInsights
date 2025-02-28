import React, { useEffect, useRef, useState } from "react";
import type { NumerologyResult } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Plus, Minus, MoveHorizontal } from "lucide-react";

interface Props {
  result: NumerologyResult;
}

export default function DNAVisualization({ result }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<number | null>(null);

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
        const nodeGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const offset = Math.sin(y * frequency + phase) * amplitude;

        node.setAttribute("cx", `${x + offset}`);
        node.setAttribute("cy", `${y}`);
        node.setAttribute("r", "3");
        node.setAttribute("fill", baseColor);
        node.setAttribute("class", "animate-pulse cursor-pointer");
        node.setAttribute("data-node-id", `${i}-${y}`);

        node.addEventListener("click", () => {
          setSelectedNode(selectedNode === i ? null : i);
        });

        nodeGroup.appendChild(node);
        svgRef.current.appendChild(nodeGroup);
      }

      svgRef.current.appendChild(wave1);
      svgRef.current.appendChild(wave2);
    }
  }, [result, zoom, pan]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedNode(null);
  };

  return (
    <div className="w-full overflow-hidden rounded-lg bg-background/30 backdrop-blur-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Your Numerological DNA Pattern</h3>
        <TooltipProvider>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.5}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleReset}
                >
                  <MoveHorizontal className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset View</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>

      <div 
        className="relative w-full aspect-[2/1] flex items-center justify-center cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          ref={svgRef}
          className="w-full h-full"
          viewBox={`${-pan.x/zoom} ${-pan.y/zoom} ${800/zoom} ${400/zoom}`}
          preserveAspectRatio="xMidYMid meet"
        />
      </div>

      {selectedNode !== null && (
        <div className="mt-4 p-4 rounded-lg bg-background/50 backdrop-blur-sm">
          <h4 className="text-lg font-medium mb-2">Pattern Segment {selectedNode + 1}</h4>
          <p className="text-sm text-muted-foreground">
            This segment represents the interaction between your Life Path ({result.lifePath}), 
            Destiny ({result.destiny}), and Expression ({result.expression}) numbers.
            The color intensity reflects your Attribute number ({result.attribute}).
          </p>
        </div>
      )}

      <p className="text-sm text-muted-foreground text-center mt-4">
        Click on any node to view detailed information about that pattern segment.
        Use the zoom controls or drag to explore the pattern in detail.
      </p>
    </div>
  );
}