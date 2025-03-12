import { useState } from "react";
import { format, startOfWeek, startOfMonth } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingState } from "./loading-states";
import { Calendar, RefreshCw, Sun, Moon, Star } from "lucide-react";
import type { NumerologyResult } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { CosmicEnergyBar } from "./cosmic-energy-bar";
import { DailyForecast } from "./daily-forecast";

interface Props {
  result: NumerologyResult;
}

export function PeriodicForecast({ result }: Props) {
  const [currentDate] = useState(new Date());
  const weekStart = startOfWeek(currentDate);
  const monthStart = startOfMonth(currentDate);

  // Weekly Forecast Query
  const {
    data: weeklyForecast,
    isLoading: weeklyLoading,
    isError: weeklyError,
    error: weeklyErrorData,
    refetch: refetchWeekly
  } = useQuery({
    queryKey: ['/api/weekly-forecast', result.id],
    queryFn: async () => {
      console.log('Fetching weekly forecast for user:', result.id);
      const response = await fetch(`/api/weekly-forecast?date=${weekStart.toISOString()}&userId=${result.id}`);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Weekly forecast error:', errorData);
        throw new Error(errorData.error || 'Failed to fetch weekly forecast');
      }
      return response.json();
    },
    enabled: !!result.id,
    retry: 1
  });

  // Monthly Forecast Query
  const {
    data: monthlyForecast,
    isLoading: monthlyLoading,
    isError: monthlyError,
    error: monthlyErrorData,
    refetch: refetchMonthly
  } = useQuery({
    queryKey: ['/api/monthly-forecast', result.id],
    queryFn: async () => {
      console.log('Fetching monthly forecast for user:', result.id);
      const response = await fetch(`/api/monthly-forecast?date=${monthStart.toISOString()}&userId=${result.id}`);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Monthly forecast error:', errorData);
        throw new Error(errorData.error || 'Failed to fetch monthly forecast');
      }
      return response.json();
    },
    enabled: !!result.id,
    retry: 1
  });

  return (
    <Tabs defaultValue="daily" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="daily" className="flex items-center gap-2">
          <Sun className="h-4 w-4" />
          Daily
        </TabsTrigger>
        <TabsTrigger value="weekly" className="flex items-center gap-2">
          <Moon className="h-4 w-4" />
          Weekly
        </TabsTrigger>
        <TabsTrigger value="monthly" className="flex items-center gap-2">
          <Star className="h-4 w-4" />
          Monthly
        </TabsTrigger>
      </TabsList>

      <TabsContent value="daily">
        <DailyForecast result={result} />
      </TabsContent>

      <TabsContent value="weekly">
        {weeklyLoading ? (
          <LoadingState type="cosmic" message="Calculating your weekly energy forecast..." />
        ) : weeklyError ? (
          <Card className="w-full bg-background/80 backdrop-blur-sm border border-primary/20">
            <CardHeader>
              <CardTitle className="text-red-500">Unable to load weekly forecast</CardTitle>
              <p className="text-sm text-muted-foreground">
                {weeklyErrorData instanceof Error ? weeklyErrorData.message : 'Failed to generate your weekly forecast'}
              </p>
            </CardHeader>
            <CardContent>
              <Button onClick={() => refetchWeekly()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : weeklyForecast ? (
          <Card className="w-full bg-background/80 backdrop-blur-sm border border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Weekly Energy Forecast
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Week of {format(weekStart, 'MMMM d, yyyy')}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 rounded-lg bg-primary/5">
                  <h3 className="font-medium mb-2">Weekly Essence: {weeklyForecast.weeklyEssence}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{weeklyForecast.weeklyTheme}</p>

                  <h4 className="font-medium mb-2">Peak Energy Days:</h4>
                  <ul className="space-y-2">
                    {weeklyForecast.peakDays.map((peak, index) => (
                      <li key={index} className="text-sm">
                        {peak.day}: Energy Level {peak.number}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-primary/5">
                    <h4 className="font-medium mb-2">Weekly Opportunities</h4>
                    <ul className="space-y-1">
                      {weeklyForecast.opportunities.map((opportunity, index) => (
                        <li key={index} className="text-sm">{opportunity}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg bg-primary/5">
                    <h4 className="font-medium mb-2">Weekly Challenges</h4>
                    <ul className="space-y-1">
                      {weeklyForecast.challenges.map((challenge, index) => (
                        <li key={index} className="text-sm">{challenge}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-primary/5">
                  <h4 className="font-medium mb-2">Guidance for the Week</h4>
                  <p className="text-sm">{weeklyForecast.guidance}</p>

                  <h4 className="font-medium mt-4 mb-2">Reflection Questions</h4>
                  <ul className="space-y-1">
                    {weeklyForecast.insights.map((insight, index) => (
                      <li key={index} className="text-sm">{insight}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </TabsContent>

      <TabsContent value="monthly">
        {monthlyLoading ? (
          <LoadingState type="cosmic" message="Calculating your monthly energy forecast..." />
        ) : monthlyError ? (
          <Card className="w-full bg-background/80 backdrop-blur-sm border border-primary/20">
            <CardHeader>
              <CardTitle className="text-red-500">Unable to load monthly forecast</CardTitle>
              <p className="text-sm text-muted-foreground">
                {monthlyErrorData instanceof Error ? monthlyErrorData.message : 'Failed to generate your monthly forecast'}
              </p>
            </CardHeader>
            <CardContent>
              <Button onClick={() => refetchMonthly()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : monthlyForecast ? (
          <Card className="w-full bg-background/80 backdrop-blur-sm border border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Monthly Energy Forecast
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {format(monthStart, 'MMMM yyyy')}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 rounded-lg bg-primary/5">
                  <h3 className="font-medium mb-2">{monthlyForecast.theme}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-sm font-medium">Personal Month Number</p>
                      <p className="text-2xl font-light text-primary">{monthlyForecast.personalMonthNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Universal Month Number</p>
                      <p className="text-2xl font-light text-primary">{monthlyForecast.universalMonthNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Monthly Essence</p>
                      <p className="text-2xl font-light text-primary">{monthlyForecast.monthlyEssence}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-primary/5">
                    <h4 className="font-medium mb-2">Monthly Opportunities</h4>
                    <ul className="space-y-1">
                      {monthlyForecast.opportunities.map((opportunity, index) => (
                        <li key={index} className="text-sm">{opportunity}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg bg-primary/5">
                    <h4 className="font-medium mb-2">Monthly Challenges</h4>
                    <ul className="space-y-1">
                      {monthlyForecast.challenges.map((challenge, index) => (
                        <li key={index} className="text-sm">{challenge}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-primary/5">
                  <h4 className="font-medium mb-2">Focus Areas for the Month</h4>
                  <ul className="space-y-1">
                    {monthlyForecast.focusAreas.map((area, index) => (
                      <li key={index} className="text-sm">{area}</li>
                    ))}
                  </ul>

                  <h4 className="font-medium mt-4 mb-2">Monthly Guidance</h4>
                  <p className="text-sm">{monthlyForecast.guidance}</p>

                  <h4 className="font-medium mt-4 mb-2">Reflection Points</h4>
                  <ul className="space-y-1">
                    {monthlyForecast.insights.map((insight, index) => (
                      <li key={index} className="text-sm">{insight}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </TabsContent>
    </Tabs>
  );
}