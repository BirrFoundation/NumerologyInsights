import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingState } from "./loading-states";
import { Calendar, Sparkles, RefreshCw } from "lucide-react";
import type { NumerologyResult } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

interface Props {
  result: NumerologyResult;
}

export function DailyForecast({ result }: Props) {
  const [currentDate] = useState(new Date());

  const {
    data: forecast,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['/api/daily-forecast', result.id, currentDate.toISOString().split('T')[0]],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/daily-forecast?date=${currentDate.toISOString().split('T')[0]}&userId=${result.id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch forecast');
        }
        return response.json();
      } catch (err) {
        console.error('Forecast fetch error:', err);
        throw err;
      }
    },
    retry: 2 // Retry failed requests twice
  });

  if (isLoading) {
    return <LoadingState type="cosmic" message="Calculating your daily energy forecast..." />;
  }

  if (isError || !forecast) {
    return (
      <Card className="w-full bg-background/80 backdrop-blur-sm border border-primary/20">
        <CardHeader>
          <CardTitle className="text-red-500">Unable to load forecast</CardTitle>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'Failed to generate your daily forecast'}
          </p>
        </CardHeader>
        <CardContent>
          <Button onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-background/80 backdrop-blur-sm border border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Daily Energy Forecast
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {currentDate.toLocaleDateString(undefined, { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => refetch()}
          className="h-8 w-8"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-primary/5 space-y-2"
            >
              <h3 className="font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Personal Day Number
              </h3>
              <p className="text-3xl font-light text-primary">
                {forecast.personalDayNumber}
              </p>
              <p className="text-sm text-muted-foreground">
                {forecast.personalDayMeaning}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-lg bg-primary/5 space-y-2"
            >
              <h3 className="font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Universal Day Energy
              </h3>
              <p className="text-3xl font-light text-primary">
                {forecast.universalDayNumber}
              </p>
              <p className="text-sm text-muted-foreground">
                {forecast.universalDayMeaning}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-lg bg-primary/5 space-y-2"
            >
              <h3 className="font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Cosmic Influence
              </h3>
              <p className="text-3xl font-light text-primary">
                {forecast.cosmicNumber}
              </p>
              <p className="text-sm text-muted-foreground">
                {forecast.cosmicInfluence}
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-lg bg-primary/5 space-y-4"
          >
            <h3 className="font-medium">Daily Guidance</h3>
            <p className="text-sm leading-relaxed">
              {forecast.dailyGuidance}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Opportunities</h4>
                <ul className="list-disc pl-4 space-y-1">
                  {forecast.opportunities.map((item: string, index: number) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="text-sm"
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Focus Areas</h4>
                <ul className="list-disc pl-4 space-y-1">
                  {forecast.focusAreas.map((item: string, index: number) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="text-sm"
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}