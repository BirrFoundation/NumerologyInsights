import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { NumerologyResult } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { ArrowRight, Plus } from "lucide-react";

interface Props {
  result: NumerologyResult;
  className?: string;
}

interface NumberNode {
  value: number;
  x: number;
  y: number;
  type: 'input' | 'reduction' | 'master' | 'final';
  connections: number[];
}

export function NumberEvolutionVisualization({ result, className }: Props) {
  const [step, setStep] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [nodes, setNodes] = useState<NumberNode[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize visualization with birth date numbers
    const date = new Date(result.birthdate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // Create initial nodes from the date components
    const initialNodes: NumberNode[] = [
      { value: month, x: 50, y: 50, type: 'input', connections: [] },
      { value: day, x: 150, y: 50, type: 'input', connections: [] },
      { value: year, x: 250, y: 50, type: 'input', connections: [] }
    ];

    setNodes(initialNodes);
  }, [result]);

  const animate = () => {
    setNodes(prevNodes => {
      const newNodes = [...prevNodes];
      
      // Add number reduction steps
      if (step === 0) {
        // First reduction step
        const sum = newNodes.reduce((acc, node) => acc + node.value, 0);
        const y = 150;
        
        newNodes.push({
          value: sum,
          x: 150,
          y,
          type: sum === 11 || sum === 22 || sum === 33 ? 'master' : 'reduction',
          connections: newNodes.map((_, i) => i)
        });
      } else if (step === 1 && !isMasterNumber(newNodes[newNodes.length - 1].value)) {
        // Further reduction if needed
        const lastNode = newNodes[newNodes.length - 1];
        const digits = lastNode.value.toString().split('').map(Number);
        const sum = digits.reduce((acc, digit) => acc + digit, 0);
        
        newNodes.push({
          value: sum,
          x: 150,
          y: 250,
          type: isMasterNumber(sum) ? 'master' : 'final',
          connections: [newNodes.length - 1]
        });
      }

      return newNodes;
    });

    setStep(prev => prev + 1);
  };

  const isMasterNumber = (num: number) => [11, 22, 33].includes(num);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && step < 2) {
      timer = setTimeout(animate, 2000 / speed);
    } else if (step >= 2) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, step, speed]);

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Number Evolution</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Speed:</span>
              <Slider
                value={[speed]}
                min={0.5}
                max={2}
                step={0.5}
                onValueChange={([value]) => setSpeed(value)}
                className="w-24"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={step >= 2}
            >
              {isPlaying ? "Pause" : "Play"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStep(0);
                setNodes(nodes.slice(0, 3));
                setIsPlaying(false);
              }}
            >
              Reset
            </Button>
          </div>
        </div>

        <div 
          ref={canvasRef}
          className="relative h-[300px] border rounded-lg bg-background/50"
        >
          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {nodes.map((node, i) => 
              node.connections.map(targetIndex => (
                <motion.path
                  key={`${i}-${targetIndex}`}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.5 }}
                  d={`M ${nodes[targetIndex].x} ${nodes[targetIndex].y} L ${node.x} ${node.y}`}
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="4 4"
                />
              ))
            )}
          </svg>

          {/* Number nodes */}
          <AnimatePresence>
            {nodes.map((node, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute"
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div
                  className={`
                    flex items-center justify-center w-12 h-12 rounded-full
                    ${node.type === 'master' ? 'bg-primary text-primary-foreground' :
                      node.type === 'final' ? 'bg-primary/20 border-2 border-primary' :
                      'bg-background border border-primary/50'}
                  `}
                >
                  <span className="text-lg font-semibold">{node.value}</span>
                </div>
                {node.type === 'master' && (
                  <div className="absolute top-full mt-1 text-xs text-center w-full text-primary">
                    Master Number
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Step indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === step ? 'bg-primary' : 'bg-primary/20'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Watch how your birth numbers combine and evolve into your Life Path number.</p>
          <p>Master numbers (11, 22, 33) are preserved in the calculation process.</p>
        </div>
      </div>
    </Card>
  );
}
