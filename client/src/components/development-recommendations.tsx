import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Target, ArrowUpCircle, BookOpen } from "lucide-react";

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
      <p className="text-lg text-muted-foreground italic">{summary}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg font-medium">
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              Key Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {recommendations.strengths.map((strength, index) => (
                <li key={index} className="text-sm">{strength}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg font-medium">
              <Target className="mr-2 h-5 w-5 text-amber-500" />
              Challenges to Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {recommendations.challenges.map((challenge, index) => (
                <li key={index} className="text-sm">{challenge}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg font-medium">
              <ArrowUpCircle className="mr-2 h-5 w-5 text-blue-500" />
              Growth Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {recommendations.growthAreas.map((area, index) => (
                <li key={index} className="text-sm">{area}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg font-medium">
              <BookOpen className="mr-2 h-5 w-5 text-purple-500" />
              Recommended Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {recommendations.practices.map((practice, index) => (
                <li key={index} className="text-sm">{practice}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
