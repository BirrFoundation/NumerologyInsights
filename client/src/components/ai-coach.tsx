import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MessageCircle,
  Sparkles,
  SendHorizontal,
  Loader2,
  AlertTriangle,
  BookOpen,
  RefreshCcw,
  Star,
  Target,
  Heart
} from "lucide-react";
import { motion } from "framer-motion";
import type { NumerologyResult } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface Props {
  result: NumerologyResult;
}

interface CoachingResponse {
  advice: string;
  followUpQuestions: string[];
}

const getPersonalInsight = (lifePath: number): string => {
  switch (lifePath) {
    case 1:
      return "Focus on leadership and independence. Your natural pioneering spirit is a great asset.";
    case 2:
      return "Your diplomatic abilities shine. Work on building harmonious relationships.";
    case 3:
      return "Express your creativity freely. Your communication skills can inspire others.";
    case 4:
      return "Build strong foundations. Your practical approach helps create lasting structures.";
    case 5:
      return "Embrace change and adventure. Your adaptability is your greatest strength.";
    case 6:
      return "Nurture and support others. Your caring nature creates harmony.";
    case 7:
      return "Seek deeper understanding. Your analytical mind uncovers hidden truths.";
    case 8:
      return "Master the material world. Your executive abilities bring success.";
    case 9:
      return "Serve humanity. Your compassionate nature helps heal others.";
    case 11:
      return "Trust your intuition. Your spiritual awareness guides others.";
    case 22:
      return "Build grand visions. Your practical mastery manifests great things.";
    case 33:
      return "Teach and heal. Your nurturing spirit uplifts humanity.";
    case 44:
      return "Bridge worlds. Your unique ability to connect material and spiritual realms is powerful.";
    default:
      return "Focus on your personal growth journey. Each number carries unique wisdom.";
  }
};

export default function AICoach({ result }: Props) {
  const [userQuery, setUserQuery] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const { toast } = useToast();

  const getCoaching = async (query?: string) => {
    const response = await fetch("/api/coaching", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        numerologyResult: result,
        userQuery: query
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to get coaching insights");
    }

    return response.json();
  };

  const { data: initialCoaching, isLoading: isInitialLoading, error: initialError, refetch } = useQuery<CoachingResponse>({
    queryKey: ["/api/coaching", result],
    queryFn: () => getCoaching(),
    retry: 2
  });

  const coachingMutation = useMutation({
    mutationFn: (query: string) => getCoaching(query),
    onSuccess: () => {
      setUserQuery("");
      setSelectedQuestion(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleAskQuestion = () => {
    if (!userQuery && !selectedQuestion) return;
    const queryToAsk = selectedQuestion || userQuery;
    coachingMutation.mutate(queryToAsk);
  };

  const handleQuestionClick = (question: string) => {
    setSelectedQuestion(question);
    setUserQuery("");
    coachingMutation.mutate(question);
  };

  if (initialError || coachingMutation.error) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg font-medium">
            <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
            AI Coach Taking a Break
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Our AI Coach is recharging. Here are some personalized insights based on your numerology:
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <Star className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Personal Insight</h4>
                <p className="text-sm text-muted-foreground">
                  {getPersonalInsight(result.lifePath)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Target className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Focus Area</h4>
                <p className="text-sm text-muted-foreground">
                  Your Expression number {result.expression} suggests focusing on {
                    result.expression === 1 ? "leadership and innovation" :
                    result.expression === 2 ? "cooperation and diplomacy" :
                    result.expression === 3 ? "creative self-expression" :
                    result.expression === 4 ? "building and organizing" :
                    result.expression === 5 ? "freedom and adaptability" :
                    result.expression === 6 ? "responsibility and service" :
                    result.expression === 7 ? "analysis and research" :
                    result.expression === 8 ? "business and achievement" :
                    result.expression === 9 ? "humanitarian work" :
                    result.expression === 11 ? "inspirational leadership" :
                    result.expression === 22 ? "large-scale projects" :
                    "teaching and healing"
                  }.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Heart className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Heart's Desire</h4>
                <p className="text-sm text-muted-foreground">
                  Your Heart's Desire number {result.heartDesire} reveals your inner motivation for {
                    result.heartDesire === 1 ? "independence and achievement" :
                    result.heartDesire === 2 ? "harmony and connection" :
                    result.heartDesire === 3 ? "creative expression" :
                    result.heartDesire === 4 ? "stability and order" :
                    result.heartDesire === 5 ? "freedom and adventure" :
                    result.heartDesire === 6 ? "love and nurturing" :
                    result.heartDesire === 7 ? "wisdom and understanding" :
                    result.heartDesire === 8 ? "success and recognition" :
                    "universal love and compassion"
                  }.
                </p>
              </div>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-4"
              onClick={() => refetch()}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Check if AI Coach is Available
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg font-medium">
          <Sparkles className="mr-2 h-5 w-5 text-primary" />
          AI Personal Development Coach
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Initial Coaching Advice */}
          {isInitialLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : initialCoaching && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="bg-primary/5 p-4 rounded-lg">
                <p className="text-sm leading-relaxed">{initialCoaching.advice}</p>
              </div>

              {/* Follow-up Questions */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-primary">Explore Further:</p>
                <div className="flex flex-wrap gap-2">
                  {initialCoaching.followUpQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className={`text-xs ${
                        selectedQuestion === question ? "bg-primary/10" : ""
                      }`}
                      onClick={() => handleQuestionClick(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Question Input */}
          <div className="flex gap-2 mt-4">
            <Input
              placeholder="Ask a specific question about your numerological path..."
              value={userQuery}
              onChange={(e) => {
                setUserQuery(e.target.value);
                setSelectedQuestion(null);
              }}
              className="flex-1"
            />
            <Button
              onClick={handleAskQuestion}
              disabled={
                (!userQuery && !selectedQuestion) ||
                coachingMutation.isPending
              }
            >
              {coachingMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SendHorizontal className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}