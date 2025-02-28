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
  RefreshCcw
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
    coachingMutation.mutate(selectedQuestion || userQuery);
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
            Our AI Coach is currently recharging. In the meantime, here are some personalized insights based on your numerology:
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <BookOpen className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Focus on Your Life Path {result.lifePath}</h4>
                <p className="text-sm text-muted-foreground">
                  Your Life Path number indicates a journey of {
                    result.lifePath === 1 ? "leadership and independence" :
                    result.lifePath === 2 ? "cooperation and harmony" :
                    result.lifePath === 3 ? "creative expression" :
                    result.lifePath === 4 ? "building solid foundations" :
                    result.lifePath === 5 ? "freedom and change" :
                    result.lifePath === 6 ? "responsibility and nurturing" :
                    result.lifePath === 7 ? "spiritual wisdom" :
                    result.lifePath === 8 ? "material mastery" :
                    result.lifePath === 9 ? "humanitarian service" :
                    result.lifePath === 11 ? "spiritual mastery" :
                    result.lifePath === 22 ? "master building" :
                    result.lifePath === 33 ? "spiritual teaching" :
                    "universal wisdom"
                  }.
                </p>
              </div>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
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