import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MessageCircle,
  Sparkles,
  SendHorizontal,
  AlertTriangle,
  Star,
  Target,
  Heart,
  RefreshCcw,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { NumerologyResult } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { LoadingState } from "./loading-states";

interface Props {
  result: NumerologyResult;
}

interface CoachingResponse {
  advice: string;
  suggestions: string[];
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
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
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
      setSelectedSuggestion(null);
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
    if (!userQuery && !selectedSuggestion) return;
    const queryToAsk = selectedSuggestion || userQuery;
    coachingMutation.mutate(queryToAsk);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSelectedSuggestion(suggestion);
    setUserQuery("");
    coachingMutation.mutate(suggestion);
  };

  // When AI service is unavailable, show personalized recommendations
  if (initialError || coachingMutation.error) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg font-medium">
            <BookOpen className="mr-2 h-5 w-5 text-primary" />
            Personal Development Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Here are your personalized numerology-based development recommendations:
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <Star className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium">Life Path Guidance</h4>
                <p className="text-sm text-muted-foreground">
                  {getPersonalInsight(result.lifePath)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Target className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium">Key Development Areas</h4>
                <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1 mt-1">
                  {result.recommendations.growthAreas.slice(0, 3).map((area, index) => (
                    <li key={index}>{area}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Heart className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium">Recommended Practices</h4>
                <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1 mt-1">
                  {result.recommendations.practices.slice(0, 3).map((practice, index) => (
                    <li key={index}>{practice}</li>
                  ))}
                </ul>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full mt-4"
              onClick={() => refetch()}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Check AI Coach Availability
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden relative">
      <AnimatePresence>
        {(isInitialLoading || coachingMutation.isPending) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10"
          >
            <LoadingState
              type="ai"
              message={isInitialLoading ? "Connecting with your AI Coach..." : "Processing your question..."}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg font-medium">
          <Sparkles className="mr-2 h-5 w-5 text-primary" />
          AI Personal Development Coach
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {initialCoaching && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-primary/5 p-4 rounded-lg">
              <p className="text-sm leading-relaxed">{initialCoaching.advice}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-primary">Suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {initialCoaching.suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className={`text-xs ${selectedSuggestion === suggestion ? "bg-primary/10" : ""}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex gap-2 mt-4">
          <Input
            placeholder="Ask a specific question about your numerological path..."
            value={userQuery}
            onChange={(e) => {
              setUserQuery(e.target.value);
              setSelectedSuggestion(null);
            }}
            className="flex-1"
          />
          <Button
            onClick={handleAskQuestion}
            disabled={(!userQuery && !selectedSuggestion) || coachingMutation.isPending}
          >
            <AnimatePresence mode="wait">
              {coachingMutation.isPending ? (
                <motion.div
                  key="loading"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <SendHorizontal className="h-4 w-4" />
                </motion.div>
              ) : (
                <motion.div
                  key="send"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                >
                  <SendHorizontal className="h-4 w-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}