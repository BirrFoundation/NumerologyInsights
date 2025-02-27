import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Target, ArrowUpCircle, BookOpen, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
        <Card className="border-primary/10">
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
                    <p className="w-[200px] text-sm">These are your natural talents and abilities. Focus on developing these further.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {recommendations.strengths.map((strength, index) => (
                <li key={index} className="text-sm leading-relaxed">{strength}</li>
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
                    <p className="w-[200px] text-sm">Transform these challenges into opportunities for personal growth.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {recommendations.challenges.map((challenge, index) => (
                <li key={index} className="text-sm leading-relaxed">{challenge}</li>
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
                    <p className="w-[200px] text-sm">Key areas to focus on for optimal personal development.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {recommendations.growthAreas.map((area, index) => (
                <li key={index} className="text-sm leading-relaxed">{area}</li>
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
                    <p className="w-[200px] text-sm">Practical exercises and habits to support your growth journey.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {recommendations.practices.map((practice, index) => (
                <li key={index} className="text-sm leading-relaxed">{practice}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}