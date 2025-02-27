import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import type { CompatibilityResult } from "@shared/schema";
import { Heart, Star, ArrowRight } from "lucide-react";

interface Props {
  result: CompatibilityResult;
  onReset: () => void;
}

export default function CompatibilityDisplay({ result, onReset }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Compatibility Analysis</h2>
        <div className="flex items-center justify-center gap-2 text-3xl">
          <Heart className="text-primary h-8 w-8" />
          <span className="text-4xl font-bold text-primary">{result.score}%</span>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Compatibility Aspects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {result.aspects.map((aspect, index) => (
              <div key={index} className="flex items-start gap-2">
                <ArrowRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm">{aspect}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Progress value={result.score} className="h-2" />

      <Button variant="outline" onClick={onReset} className="w-full">
        Calculate Another Compatibility
      </Button>
    </div>
  );
}
