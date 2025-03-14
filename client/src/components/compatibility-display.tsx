import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import type { CompatibilityResult } from "@shared/schema";
import { Heart, Star, ArrowRight, Zap, Users, Sparkles, Briefcase, Building2, UserPlus, Home } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  result: CompatibilityResult;
  onReset: () => void;
  person1Name?: string;
  person2Name?: string;
}

export default function CompatibilityDisplay({ result, onReset, person1Name = "Person 1", person2Name = "Person 2" }: Props) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-amber-500";
    return "text-blue-500";
  };

  // Ensure zodiac compatibility data exists with defaults
  const zodiacData = result?.zodiacCompatibility ?? {
    person1: "Unknown",
    person2: "Unknown",
    score: 0,
    description: "Zodiac compatibility data not available",
  };

  // Ensure year difference data exists with defaults
  const yearData = result?.yearDifference ?? {
    score: 0,
    description: "Year cycle analysis not available"
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
          <Heart className={`h-8 w-8 ${getScoreColor(result?.score ?? 0)}`} />
          <span className={`text-4xl font-bold ${getScoreColor(result?.score ?? 0)}`}>
            {result?.score ?? 0}%
          </span>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Chinese Zodiac Analysis */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Chinese Zodiac Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Zodiac Signs</h4>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">{person1Name}:</span> {zodiacData.person1} zodiac
                </p>
                <p className="text-sm">
                  <span className="font-medium">{person2Name}:</span> {zodiacData.person2} zodiac
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Zodiac Compatibility</h4>
              <p className="text-sm text-muted-foreground">
                {zodiacData.description}
              </p>
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Compatibility</span>
                  <span className="text-sm font-medium">{zodiacData.score}%</span>
                </div>
                <Progress value={zodiacData.score} className="h-2" />
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Year Cycle Analysis</h4>
              <p className="text-sm text-muted-foreground">
                {yearData.description}
              </p>
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Cycle Harmony</span>
                  <span className="text-sm font-medium">{yearData.score}%</span>
                </div>
                <Progress value={yearData.score} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compatibility Metrics */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Numerology Compatibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Life Path Harmony</span>
                <span className="text-sm text-muted-foreground">{result?.lifePathScore ?? 0}%</span>
              </div>
              <Progress value={result?.lifePathScore ?? 0} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Expression Match</span>
                <span className="text-sm text-muted-foreground">{result?.expressionScore ?? 0}%</span>
              </div>
              <Progress value={result?.expressionScore ?? 0} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Emotional Connection</span>
                <span className="text-sm text-muted-foreground">{result?.heartDesireScore ?? 0}%</span>
              </div>
              <Progress value={result?.heartDesireScore ?? 0} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Relationship Types Grid */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Relationship Type Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {Object.entries(result?.relationshipTypes ?? {}).map(([type, data]) => (
                <div key={type} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {type === 'work' && <Briefcase className="h-5 w-5 text-primary" />}
                      {type === 'business' && <Building2 className="h-5 w-5 text-primary" />}
                      {type === 'friendship' && <UserPlus className="h-5 w-5 text-primary" />}
                      {type === 'family' && <Home className="h-5 w-5 text-primary" />}
                      <h4 className="font-medium capitalize">{type} Compatibility</h4>
                    </div>
                    <span className="text-sm font-medium">{data?.score ?? 0}%</span>
                  </div>
                  <Progress value={data?.score ?? 0} className="h-2" />
                  {(data?.strengths?.length ?? 0) > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Strengths:</p>
                      <ul className="list-disc pl-5">
                        {data?.strengths?.map((strength, i) => (
                          <li key={i} className="text-sm leading-relaxed">{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {(data?.challenges?.length ?? 0) > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Challenges:</p>
                      <ul className="list-disc pl-5">
                        {data?.challenges?.map((challenge, i) => (
                          <li key={i} className="text-sm leading-relaxed">{challenge}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Aspects section */}
        {(result?.aspects?.length ?? 0) > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Key Compatibility Aspects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result?.aspects?.map((aspect, index) => (
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
        )}

        {/* Dynamics section */}
        {(result?.dynamics?.length ?? 0) > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Relationship Dynamics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result?.dynamics?.map((dynamic, index) => (
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
        )}

        {/* Growth Areas section */}
        {(result?.growthAreas?.length ?? 0) > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Growth Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result?.growthAreas?.map((area, index) => (
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
        )}
      </div>

      <div className="flex justify-center">
        <Button onClick={onReset} variant="outline" className="w-full max-w-md">
          Calculate Another Compatibility
        </Button>
      </div>
    </div>
  );
}