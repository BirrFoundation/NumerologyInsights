import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NumerologyForm from "@/components/numerology-form";
import CompatibilityForm from "@/components/compatibility-form";
import ResultsDisplay from "@/components/results-display";
import CompatibilityDisplay from "@/components/compatibility-display";
import { useState } from "react";
import { useLocation } from "wouter";
import type { NumerologyResult, CompatibilityResult } from "@shared/schema";

type Mode = "numerology" | "compatibility";
type Result = { type: "numerology"; data: NumerologyResult } | { type: "compatibility"; data: CompatibilityResult };

export default function Home() {
  const [mode, setMode] = useState<Mode>("numerology");
  const [result, setResult] = useState<Result | null>(null);
  const [, setLocation] = useLocation();

  const handleReset = () => {
    setResult(null);
  };

  const handleCompatibility = () => {
    setMode("compatibility");
    setResult(null);
  };

  return (
    <div className="min-h-screen w-full relative">
      {/* Background Layer */}
      <div className="fixed inset-0 bg-gradient-to-b from-background to-primary/5">
        <div className="absolute inset-0 overflow-hidden opacity-5">
          <div className="absolute inset-0 animate-float-slow">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute text-primary/20 font-mono"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  fontSize: `${Math.random() * 3 + 1}rem`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                  animation: `float ${Math.random() * 10 + 5}s infinite linear`
                }}
              >
                {Math.floor(Math.random() * 9) + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-2 sm:px-4 py-8 sm:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-7xl font-extralight bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50 bg-clip-text text-transparent animate-gradient tracking-widest">
            <span className="font-light">DEB</span>
            <span className="font-extralight">TERA</span>
            <span className="font-thin"> READING</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-extralight max-w-2xl mx-auto mt-6 tracking-wide">
            Unlock the hidden patterns in your numerological DNA through the ancient wisdom of numbers
          </p>
          {!result && (
            <div className="flex justify-center gap-4 pt-8">
              <Button
                variant={mode === "numerology" ? "default" : "outline"}
                onClick={() => setMode("numerology")}
                className="font-light"
              >
                Personal Reading
              </Button>
              <Button
                variant={mode === "compatibility" ? "default" : "outline"}
                onClick={() => setMode("compatibility")}
                className="font-light"
              >
                Compatibility Reading
              </Button>
            </div>
          )}
        </div>

        <Card className="backdrop-blur-sm bg-background/95 border-primary/10 shadow-lg">
          <CardContent className="p-6">
            {!result ? (
              mode === "numerology" ? (
                <NumerologyForm 
                  onResult={(data) => setResult({ type: "numerology", data })} 
                />
              ) : (
                <CompatibilityForm 
                  onResult={(data) => setResult({ type: "compatibility", data })} 
                />
              )
            ) : result.type === "numerology" ? (
              <ResultsDisplay 
                result={result.data} 
                onReset={handleReset}
                onCompatibility={handleCompatibility}
              />
            ) : (
              <CompatibilityDisplay 
                result={result.data} 
                onReset={handleReset} 
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}