import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Target, ArrowUpCircle, BookOpen, Info, Star } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

interface Recommendations {
  strengths: string[];
  challenges: string[];
  growthAreas: string[];
  practices: string[];
}

interface Props {
  recommendations: Recommendations;
  summary: string;
}

export default function DevelopmentRecommendations({ recommendations, summary }: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-primary/5 p-6 rounded-lg">
        <p className="text-lg text-foreground font-light leading-relaxed">
          {summary}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-primary/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2">
            <Star className="h-5 w-5 text-yellow-500" />
          </div>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg font-medium">
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              Key Strengths
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="ml-2 h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[200px] text-sm">These are your natural talents and abilities that form the foundation of your personal growth. Focus on developing these further to achieve your full potential.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {recommendations.strengths.map((strength, index) => (
                <li key={index} className="text-sm leading-relaxed">
                  <div className="flex items-center justify-between gap-4">
                    <span>{strength}</span>
                    <Progress value={90 - (index * 10)} className="w-20 h-1" />
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-primary/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg font-medium">
              <Target className="mr-2 h-5 w-5 text-amber-500" />
              Areas for Growth
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="ml-2 h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[200px] text-sm">Transform these challenges into opportunities for personal growth. Each challenge presents a unique chance to develop new strengths.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {recommendations.challenges.map((challenge, index) => (
                <li key={index} className="text-sm leading-relaxed">
                  <div className="flex items-center justify-between gap-4">
                    <span>{challenge}</span>
                    <Progress value={75 - (index * 10)} className="w-20 h-1" />
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-primary/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg font-medium">
              <ArrowUpCircle className="mr-2 h-5 w-5 text-blue-500" />
              Development Focus
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="ml-2 h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[200px] text-sm">These key areas deserve your focused attention for optimal personal development. Prioritize these aspects in your growth journey.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {recommendations.growthAreas.map((area, index) => (
                <li key={index} className="text-sm leading-relaxed">
                  <div className="flex items-center justify-between gap-4">
                    <span>{area}</span>
                    <Progress value={85 - (index * 10)} className="w-20 h-1" />
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-primary/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg font-medium">
              <BookOpen className="mr-2 h-5 w-5 text-purple-500" />
              Daily Practices
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="ml-2 h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[200px] text-sm">Incorporate these practical exercises and habits into your daily routine to support your personal growth journey.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {recommendations.practices.map((practice, index) => (
                <li key={index} className="text-sm leading-relaxed">
                  <div className="flex items-center justify-between gap-4">
                    <span>{practice}</span>
                    <Progress value={80 - (index * 10)} className="w-20 h-1" />
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}