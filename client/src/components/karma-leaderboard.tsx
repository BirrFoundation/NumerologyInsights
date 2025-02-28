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

// Mock data for now - will be replaced with real data later
interface KarmaUser {
  id: number;
  name: string;
  karmaPoints: number;
  rank: number;
  auraColor: string;
  lastActivity: string;
}

const mockUsers: KarmaUser[] = [
  {
    id: 1,
    name: "Cosmic Explorer",
    karmaPoints: 1234,
    rank: 1,
    auraColor: "from-violet-500 to-purple-600",
    lastActivity: "Completed Soul Path Reading"
  },
  {
    id: 2,
    name: "Star Seeker",
    karmaPoints: 987,
    rank: 2,
    auraColor: "from-blue-500 to-cyan-500",
    lastActivity: "Shared Numerology Insights"
  },
  {
    id: 3,
    name: "Light Walker",
    karmaPoints: 756,
    rank: 3,
    auraColor: "from-pink-500 to-rose-500",
    lastActivity: "Daily Numerology Practice"
  }
];

export function KarmaLeaderboard() {
  const [sortBy, setSortBy] = useState<"karmaPoints" | "lastActivity">("karmaPoints");
  const [users] = useState<KarmaUser[]>(mockUsers);

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
