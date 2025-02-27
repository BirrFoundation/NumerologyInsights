import { Card, CardContent } from "@/components/ui/card";
import NumerologyForm from "@/components/numerology-form";
import ResultsDisplay from "@/components/results-display";
import { useState } from "react";
import type { NumerologyResult } from "@shared/schema";

export default function Home() {
  const [result, setResult] = useState<NumerologyResult | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Numerology Calculator
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover the hidden meanings in your name and birthdate
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-background/95">
          <CardContent className="p-6">
            {!result ? (
              <NumerologyForm onResult={setResult} />
            ) : (
              <ResultsDisplay 
                result={result} 
                onReset={() => setResult(null)} 
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
