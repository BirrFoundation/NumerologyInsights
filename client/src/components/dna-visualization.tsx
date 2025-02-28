import React, { useEffect, useRef, useState } from "react";
import type { NumerologyResult } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Plus, Minus, MoveHorizontal, ZoomIn, Focus, Move } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  result: NumerologyResult;
}

interface ViewportState {
  zoom: number;
  pan: { x: number; y: number };
  selectedRegion: { x: number; y: number; width: number; height: number } | null;
}

export default function DNAVisualization({ result }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState<ViewportState>({
    zoom: 1,
    pan: { x: 0, y: 0 },
    selectedRegion: null
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [showNodeDialog, setShowNodeDialog] = useState(false);
  const [detailMode, setDetailMode] = useState<'overview' | 'detail'>('overview');

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

    // Create DNA helix patterns with numerological influence
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

      for (let y = 0; y <= height; y += 5) { // Increased resolution for smoother curves
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

      // Add interactive nodes at intersections
      for (let y = 0; y <= height; y += 50) {
        const nodeGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const node = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        const glow = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        const offset = Math.sin(y * frequency + phase) * amplitude;

        // Glow effect
        glow.setAttribute("cx", `${x + offset}`);
        glow.setAttribute("cy", `${y}`);
        glow.setAttribute("r", "6");
        glow.setAttribute("fill", baseColor);
        glow.setAttribute("opacity", "0.5");
        glow.setAttribute("filter", "url(#glow)");

        // Main node
        node.setAttribute("cx", `${x + offset}`);
        node.setAttribute("cy", `${y}`);
        node.setAttribute("r", "4");
        node.setAttribute("fill", baseColor);
        node.setAttribute("class", "animate-pulse cursor-pointer");
        node.setAttribute("data-node-id", `${i}-${y}`);

        node.addEventListener("click", () => {
          setSelectedNode(i);
          setShowNodeDialog(true);
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setViewport(prev => ({
              ...prev,
              selectedRegion: {
                x: x + offset - 50,
                y: y - 50,
                width: 100,
                height: 100
              }
            }));
            setDetailMode('detail');
          }
        });

        nodeGroup.appendChild(glow);
        nodeGroup.appendChild(node);
        svgRef.current.appendChild(nodeGroup);
      }

      svgRef.current.appendChild(wave1);
      svgRef.current.appendChild(wave2);
    }
  }, [result, viewport.zoom, viewport.pan]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - viewport.pan.x, y: e.clientY - viewport.pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setViewport(prev => ({
      ...prev,
      pan: {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      }
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setViewport(prev => ({
      ...prev,
      zoom: Math.min(prev.zoom + 0.2, 3)
    }));
  };

  const handleZoomOut = () => {
    setViewport(prev => ({
      ...prev,
      zoom: Math.max(prev.zoom - 0.2, 0.5)
    }));
  };

  const handleZoomChange = (value: number[]) => {
    setViewport(prev => ({
      ...prev,
      zoom: value[0]
    }));
  };

  const handleReset = () => {
    setViewport({
      zoom: 1,
      pan: { x: 0, y: 0 },
      selectedRegion: null
    });
    setSelectedNode(null);
    setShowNodeDialog(false);
    setDetailMode('overview');
  };

  const getViewBox = () => {
    if (detailMode === 'detail' && viewport.selectedRegion) {
      const { x, y, width, height } = viewport.selectedRegion;
      return `${x} ${y} ${width} ${height}`;
    }
    return `${-viewport.pan.x/viewport.zoom} ${-viewport.pan.y/viewport.zoom} ${800/viewport.zoom} ${400/viewport.zoom}`;
  };

  return (
    <div className="w-full overflow-hidden rounded-lg bg-background/30 backdrop-blur-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Your Numerological DNA Pattern</h3>
        <TooltipProvider>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Zoom:</span>
              <div className="w-32">
                <Slider
                  value={[viewport.zoom]}
                  min={0.5}
                  max={3}
                  step={0.1}
                  onValueChange={handleZoomChange}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleZoomIn}
                    disabled={viewport.zoom >= 3}
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
                    disabled={viewport.zoom <= 0.5}
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

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setDetailMode(prev => prev === 'overview' ? 'detail' : 'overview')}
                  >
                    {detailMode === 'overview' ? (
                      <ZoomIn className="h-4 w-4" />
                    ) : (
                      <Focus className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {detailMode === 'overview' ? 'Enter Detail View' : 'Return to Overview'}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </TooltipProvider>
      </div>

      <div 
        ref={containerRef}
        className="relative w-full aspect-[2/1] flex items-center justify-center cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          ref={svgRef}
          className="w-full h-full"
          viewBox={getViewBox()}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
        </svg>

        {/* Interaction guide overlay */}
        <AnimatePresence>
          {!selectedNode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none flex items-center justify-center"
            >
              <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Move className="h-4 w-4" />
                  <span>Drag to pan</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <Focus className="h-4 w-4" />
                  <span>Click nodes to explore</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Dialog open={showNodeDialog} onOpenChange={setShowNodeDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>DNA Pattern Segment {selectedNode !== null ? selectedNode + 1 : ''}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-primary/5">
              <h4 className="text-lg font-medium mb-2">Numerological Influence</h4>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Life Path Influence:</span> This segment shows the influence of your Life Path number {result.lifePath}, expressing {selectedNode !== null && selectedNode % 2 === 0 ? "active" : "receptive"} energy.
                </p>
                <p className="text-sm">
                  <span className="font-medium">Destiny Connection:</span> Your Destiny number {result.destiny} manifests here through {selectedNode !== null && selectedNode % 3 === 0 ? "transformative" : "stabilizing"} patterns.
                </p>
                <p className="text-sm">
                  <span className="font-medium">Expression Channel:</span> Your Expression number {result.expression} flows through this segment, creating {selectedNode !== null && selectedNode % 4 === 0 ? "dynamic" : "harmonious"} interactions.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-background border">
                <h5 className="font-medium mb-2">Energy Flow</h5>
                <p className="text-sm text-muted-foreground">
                  This segment represents a {selectedNode !== null && selectedNode % 2 === 0 ? "peak" : "valley"} in your numerological DNA pattern, indicating periods of {selectedNode !== null && selectedNode % 2 === 0 ? "heightened activity" : "introspection"}.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-background border">
                <h5 className="font-medium mb-2">Pattern Significance</h5>
                <p className="text-sm text-muted-foreground">
                  The unique shape and color of this segment reflects the interaction between your Life Path ({result.lifePath}) and Attribute ({result.attribute}) numbers.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <p className="text-sm text-muted-foreground text-center mt-4">
        Click on any node to view detailed information about that pattern segment.
        Use the zoom controls or drag to explore the pattern in detail.
      </p>
    </div>
  );
}