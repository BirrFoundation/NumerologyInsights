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

  const getScoreDescription = (score: number) => {
    if (score >= 80) return "Exceptional Compatibility";
    if (score >= 60) return "Good Compatibility";
    if (score >= 40) return "Moderate Compatibility";
    return "Challenging Compatibility";
  };

  // Ensure all arrays exist with default empty arrays
  const aspects = result?.aspects ?? [];
  const dynamics = result?.dynamics ?? [];
  const growthAreas = result?.growthAreas ?? [];

  // Ensure all scores exist with default 0
  const score = result?.score ?? 0;
  const lifePathScore = result?.lifePathScore ?? 0;
  const expressionScore = result?.expressionScore ?? 0;
  const heartDesireScore = result?.heartDesireScore ?? 0;
  const zodiacScore = result?.zodiacCompatibility?.score ?? 0;
  const yearDiffScore = result?.yearDifferenceScore ?? 0;

  // Get zodiac signs
  const zodiacSign1 = result?.zodiacCompatibility?.person1 ?? '';
  const zodiacSign2 = result?.zodiacCompatibility?.person2 ?? '';

  const getZodiacCompatibilityDescription = (score: number, sign1: string, sign2: string) => {
    if (score >= 80) return `${sign1} and ${sign2} are highly compatible signs in Chinese astrology, creating a harmonious and balanced relationship.`;
    if (score >= 60) return `${sign1} and ${sign2} have good compatibility, with complementary energies that can work well together.`;
    if (score >= 40) return `${sign1} and ${sign2} may face some challenges, but these can be overcome with understanding and patience.`;
    return `${sign1} and ${sign2} will need to work on understanding each other's different approaches to life.`;
  };

  const getYearDifferenceDescription = (score: number) => {
    if (score >= 90) return "Your birth years create an auspicious 12-year cycle alignment, traditionally considered very favorable.";
    if (score <= 40) return "Your birth years are in a 6-year difference cycle, which traditionally suggests the need for extra understanding and adaptation.";
    return "Your birth year difference creates an interesting dynamic that can be worked with positively.";
  };

  // Ensure relationship types exist with default values
  const relationshipTypes = result?.relationshipTypes ?? {
    work: { score: 0, strengths: [], challenges: [] },
    business: { score: 0, strengths: [], challenges: [] },
    friendship: { score: 0, strengths: [], challenges: [] },
    family: { score: 0, strengths: [], challenges: [] }
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
          <Heart className={`h-8 w-8 ${getScoreColor(score)}`} />
          <span className={`text-4xl font-bold ${getScoreColor(score)}`}>
            {score}%
          </span>
        </div>
        <p className="text-lg font-medium text-muted-foreground">
          {getScoreDescription(score)}
        </p>
      </motion.div>

      {/* Main Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Chinese Zodiac Compatibility */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Chinese Zodiac Compatibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <p><span className="font-medium">{person1Name}:</span> {zodiacSign1} sign</p>
                  <p><span className="font-medium">{person2Name}:</span> {zodiacSign2} sign</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {getZodiacCompatibilityDescription(zodiacScore, zodiacSign1, zodiacSign2)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Year Cycle Analysis:</p>
              <p className="text-sm text-muted-foreground mb-2">
                {getYearDifferenceDescription(yearDiffScore)}
              </p>
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
                <span className="text-sm text-muted-foreground">{lifePathScore}%</span>
              </div>
              <Progress value={lifePathScore} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Expression Match</span>
                <span className="text-sm text-muted-foreground">{expressionScore}%</span>
              </div>
              <Progress value={expressionScore} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Emotional Connection</span>
                <span className="text-sm text-muted-foreground">{heartDesireScore}%</span>
              </div>
              <Progress value={heartDesireScore} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Compatibility Aspects */}
        {aspects.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Key Compatibility Aspects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aspects.map((aspect, index) => (
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
              {Object.entries(relationshipTypes).map(([type, data], index) => (
                <div key={type} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {type === 'work' && <Briefcase className="h-5 w-5 text-primary" />}
                      {type === 'business' && <Building2 className="h-5 w-5 text-primary" />}
                      {type === 'friendship' && <UserPlus className="h-5 w-5 text-primary" />}
                      {type === 'family' && <Home className="h-5 w-5 text-primary" />}
                      <h4 className="font-medium capitalize">{type} Compatibility</h4>
                    </div>
                    <span className="text-sm font-medium">{data.score}%</span>
                  </div>
                  <Progress value={data.score} className="h-2" />
                  <div className="space-y-4">
                    {data.strengths.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Strengths:</p>
                        <ul className="list-disc pl-5">
                          {data.strengths.map((strength, i) => (
                            <li key={i} className="text-sm leading-relaxed">{strength}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {data.challenges.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Challenges:</p>
                        <ul className="list-disc pl-5">
                          {data.challenges.map((challenge, i) => (
                            <li key={i} className="text-sm leading-relaxed">{challenge}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {dynamics.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Relationship Dynamics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dynamics.map((dynamic, index) => (
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

        {growthAreas.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Growth Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {growthAreas.map((area, index) => (
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