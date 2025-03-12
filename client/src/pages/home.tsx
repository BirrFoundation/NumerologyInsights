import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NumerologyForm from "@/components/numerology-form";
import CompatibilityForm from "@/components/compatibility-form";
import ResultsDisplay from "@/components/results-display";
import CompatibilityDisplay from "@/components/compatibility-display";
import { useState } from "react";
import { useLocation } from "wouter";
import { LogOut } from "lucide-react";
import type { NumerologyResult, CompatibilityResult } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

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

  const handleSignOut = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
      localStorage.removeItem('isAuthenticated');
      setLocation('/login');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
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

      {/* Header with Sign Out */}
      <div className="relative z-10 w-full px-1 py-2 sm:px-4 sm:py-4">
        <div className="flex justify-end max-w-[1400px] mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-primary"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-0.5 sm:px-4 py-6 sm:py-16">
        <div className="text-center mb-6 sm:mb-12">
          <h1 className="text-4xl md:text-7xl font-extralight bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50 bg-clip-text text-transparent animate-gradient tracking-widest">
            <span className="font-light">DEB</span>
            <span className="font-extralight">TERA</span>
            <span className="font-thin"> READING</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-extralight max-w-2xl mx-auto mt-4 tracking-wide">
            Unlock the hidden patterns in your numerological DNA through the ancient wisdom of numbers
          </p>
          {!result && (
            <div className="flex justify-center gap-2 sm:gap-4 pt-6">
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

        <Card className="backdrop-blur-sm bg-background/95 border-primary/10 shadow-lg w-[99.8%] mx-auto">
          <CardContent className="p-1 sm:p-6">
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