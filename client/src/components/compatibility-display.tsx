import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import type { CompatibilityResult } from "@shared/schema";
import { Heart, Star, ArrowRight, Zap, Users, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  result: CompatibilityResult;
  onReset: () => void;
}

export default function CompatibilityDisplay({ result, onReset }: Props) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-amber-500";
    return "text-blue-500";
  };

  const getScoreDescription = (score: number) => {
    if (score >= 80) return "Exceptional Compatibility";
    if (score >= 60) return "Good Compatibility";
    if (score >= 40) return "Moderate Compatibility";
    return "Challenging Compatibility";
  };

  return (
    <div className="space-y-8">
      {/* Header with Animation */}
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold">Compatibility Analysis</h2>
        <div className="flex items-center justify-center gap-4">
          <Heart className={`h-8 w-8 ${getScoreColor(result.score)}`} />
          <span className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
            {result.score}%
          </span>
        </div>
        <p className="text-lg font-medium text-muted-foreground">
          {getScoreDescription(result.score)}
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Compatibility Aspects */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Key Compatibility Aspects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.aspects.map((aspect, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ArrowRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{aspect}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Compatibility Metrics */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Compatibility Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Life Path Harmony</span>
                <span className="text-sm text-muted-foreground">{result.lifePathScore}%</span>
              </div>
              <Progress value={result.lifePathScore} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Expression Match</span>
                <span className="text-sm text-muted-foreground">{result.expressionScore}%</span>
              </div>
              <Progress value={result.expressionScore} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Emotional Connection</span>
                <span className="text-sm text-muted-foreground">{result.heartDesireScore}%</span>
              </div>
              <Progress value={result.heartDesireScore} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Relationship Dynamics */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Relationship Dynamics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.dynamics.map((dynamic, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Sparkles className="h-4 w-4 text-primary" />
                  <p className="text-sm">{dynamic}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Growth Opportunities */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Growth Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.growthAreas.map((area, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ArrowRight className="h-4 w-4 text-primary" />
                  <p className="text-sm">{area}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button onClick={onReset} variant="outline" className="w-full max-w-md">
          Calculate Another Compatibility
        </Button>
      </div>
    </div>
  );
}