import { DreamInputForm } from "@/components/dream-input";
import { DreamInterpretation } from "@/components/dream-interpretation";
import { useQuery } from "@tanstack/react-query";
import { DreamRecord } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function DreamJournalPage() {
  const { data: dreams, isLoading } = useQuery<DreamRecord[]>({
    queryKey: ["/api/dreams"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Numerological Dream Journal</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <DreamInputForm />
        </div>

        <div>
          {dreams && dreams.length > 0 ? (
            <Tabs defaultValue={dreams[0].id.toString()}>
              <TabsList className="w-full h-auto flex-wrap">
                {dreams.map((dream) => (
                  <TabsTrigger key={dream.id} value={dream.id.toString()}>
                    {format(new Date(dream.dreamDate), "MMM d, yyyy")}
                  </TabsTrigger>
                ))}
              </TabsList>
              {dreams.map((dream) => (
                <TabsContent key={dream.id} value={dream.id.toString()}>
                  <DreamInterpretation interpretation={dream.interpretation} />
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <Card className="p-6">
              <p className="text-center text-muted-foreground">
                No dream records yet. Start by recording your first dream.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
