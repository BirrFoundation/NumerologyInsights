import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Crown, Star, Sparkles, ArrowUpRight } from "lucide-react";
import type { NumerologyResult } from "@shared/schema";

interface Props {
  result: NumerologyResult;
}

interface KarmaUser {
  id: number;
  name: string;
  karmaPoints: number;
  rank: number;
  auraColor: string;
  lastActivity: string;
}

// Calculate karma points based on numerology numbers
function calculateKarmaPoints(result: NumerologyResult): number {
  let points = 0;

  // Master numbers provide bonus points
  if ([11, 22, 33, 44].includes(result.lifePath)) points += 300;
  if ([11, 22, 33, 44].includes(result.destiny)) points += 250;
  if ([11, 22, 33, 44].includes(result.expression)) points += 200;

  // Special number 28 (wealth number) adds points
  if (result.birthDateNum === 28) points += 280;

  // High karmic number 8 influence
  if ([8, 44].includes(result.lifePath)) points += 150;
  if ([8, 44].includes(result.destiny)) points += 120;

  // Base calculations from core numbers
  points += result.lifePath * 25;
  points += result.destiny * 20;
  points += result.expression * 15;
  points += result.heartDesire * 15;
  points += result.personality * 10;

  return Math.round(points);
}

// Generate aura color based on numerological profile
function getAuraColor(result: NumerologyResult): string {
  if ([11, 22, 33, 44].includes(result.lifePath)) {
    return "from-violet-500 to-purple-600"; // Master number aura
  }
  if (result.birthDateNum === 28) {
    return "from-yellow-400 to-amber-600"; // Wealth number aura
  }
  if ([8, 44].includes(result.lifePath)) {
    return "from-blue-500 to-cyan-500"; // Karmic number aura
  }
  switch (result.lifePath % 9 || 9) {
    case 1: return "from-red-500 to-orange-500";
    case 2: return "from-blue-400 to-indigo-500";
    case 3: return "from-yellow-400 to-orange-500";
    case 4: return "from-green-500 to-emerald-600";
    case 5: return "from-purple-400 to-pink-500";
    case 6: return "from-pink-400 to-rose-500";
    case 7: return "from-indigo-500 to-purple-600";
    case 8: return "from-blue-500 to-cyan-500";
    default: return "from-violet-400 to-purple-500";
  }
}

// Generate last activity based on strongest numerological influences
function getLastActivity(result: NumerologyResult): string {
  if ([11, 22, 33, 44].includes(result.lifePath)) {
    return "Mastered Spiritual Insight";
  }
  if (result.birthDateNum === 28) {
    return "Achieved Wealth Harmony";
  }
  if ([8, 44].includes(result.lifePath)) {
    return "Balanced Karmic Energy";
  }

  const activities = [
    "Completed Soul Path Reading",
    "Achieved Numerological Balance",
    "Harmonized Life Numbers",
    "Unlocked Spiritual Insights",
    "Mastered Energy Flow"
  ];

  return activities[Math.floor(Math.random() * activities.length)];
}

export function KarmaLeaderboard({ result }: Props) {
  const [sortBy, setSortBy] = useState<"karmaPoints" | "lastActivity">("karmaPoints");

  // Calculate user's karma points
  const userKarmaPoints = calculateKarmaPoints(result);

  // Generate dynamic leaderboard data
  const users: KarmaUser[] = [
    {
      id: 1,
      name: result.name,
      karmaPoints: userKarmaPoints,
      rank: 1,
      auraColor: getAuraColor(result),
      lastActivity: getLastActivity(result)
    },
    {
      id: 2,
      name: "Star Seeker",
      karmaPoints: Math.round(userKarmaPoints * 0.85),
      rank: 2,
      auraColor: "from-blue-500 to-cyan-500",
      lastActivity: "Shared Numerology Insights"
    },
    {
      id: 3,
      name: "Light Walker",
      karmaPoints: Math.round(userKarmaPoints * 0.7),
      rank: 3,
      auraColor: "from-pink-500 to-rose-500",
      lastActivity: "Daily Numerology Practice"
    }
  ];

  return (
    <Card className="w-full overflow-hidden bg-background/80 backdrop-blur-sm border border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          Cosmic Karma Leaderboard
        </CardTitle>
        <CardDescription>
          Top spiritual seekers and their karmic achievements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-end gap-2">
            <Button
              variant={sortBy === "karmaPoints" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("karmaPoints")}
            >
              Karma Points
            </Button>
            <Button
              variant={sortBy === "lastActivity" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("lastActivity")}
            >
              Recent Activity
            </Button>
          </div>

          <div className="space-y-2">
            <AnimatePresence>
              {users.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className={`
                    absolute inset-0 opacity-10 rounded-lg
                    bg-gradient-to-r ${user.auraColor}
                  `} />
                  <div className="relative p-4 rounded-lg border backdrop-blur-sm hover:bg-primary/5 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                          {index === 0 ? (
                            <Crown className="h-4 w-4 text-yellow-500" />
                          ) : index === 1 ? (
                            <Star className="h-4 w-4 text-gray-400" />
                          ) : index === 2 ? (
                            <Star className="h-4 w-4 text-amber-700" />
                          ) : (
                            <Sparkles className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.lastActivity}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="font-mono font-medium">
                            {user.karmaPoints.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            karma points
                          </p>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}