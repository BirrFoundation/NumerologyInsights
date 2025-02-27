import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MessageCircle,
  Sparkles,
  SendHorizontal,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { NumerologyResult } from "@shared/schema";

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
      throw new Error("Failed to get coaching insights");
    }

    return response.json();
  };

  const { data: initialCoaching, isLoading: isInitialLoading } = useQuery<CoachingResponse>({
    queryKey: ["/api/coaching", result],
    queryFn: () => getCoaching()
  });

  const coachingMutation = useMutation({
    mutationFn: (query: string) => getCoaching(query),
    onSuccess: () => {
      setUserQuery("");
      setSelectedQuestion(null);
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

          {/* Additional Coaching Responses */}
          <AnimatePresence>
            {coachingMutation.data && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="bg-primary/5 p-4 rounded-lg">
                  <p className="text-sm leading-relaxed">
                    {coachingMutation.data.advice}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-primary">
                    Follow-up Insights:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {coachingMutation.data.followUpQuestions.map(
                      (question, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => handleQuestionClick(question)}
                        >
                          {question}
                        </Button>
                      )
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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