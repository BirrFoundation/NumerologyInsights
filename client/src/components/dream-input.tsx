import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { dreamInputSchema, type InsertDream } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { Card } from "./ui/card";
import { MultiSelect } from "./ui/multi-select";

const EMOTION_OPTIONS = [
  "Joy", "Fear", "Sadness", "Anger", "Confusion",
  "Peace", "Anxiety", "Love", "Excitement", "Wonder"
];

const SYMBOL_OPTIONS = [
  "Water", "Fire", "Air", "Earth", "Animals",
  "Flying", "Falling", "Chase", "Door", "Light",
  "Darkness", "Numbers", "Colors", "People", "Nature"
];

export function DreamInputForm() {
  const { toast } = useToast();
  const form = useForm<InsertDream>({
    resolver: zodResolver(dreamInputSchema),
    defaultValues: {
      description: "",
      dreamDate: new Date().toISOString().split('T')[0],
      emotions: [],
      symbols: []
    }
  });

  const dreamMutation = useMutation({
    mutationFn: async (data: InsertDream) => {
      const res = await apiRequest("POST", "/api/dreams/interpret", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Dream recorded successfully",
        description: "Your dream has been interpreted through numerology.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/dreams"] });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to record dream",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Record Your Dream</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => dreamMutation.mutate(data))} className="space-y-6">
          <FormField
            control={form.control}
            name="dreamDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dream Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dream Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your dream in detail..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="emotions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emotions Felt</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={EMOTION_OPTIONS}
                    selected={field.value}
                    onChange={field.onChange}
                    placeholder="Select emotions..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="symbols"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dream Symbols</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={SYMBOL_OPTIONS}
                    selected={field.value}
                    onChange={field.onChange}
                    placeholder="Select symbols..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full"
            disabled={dreamMutation.isPending}
          >
            {dreamMutation.isPending ? "Interpreting..." : "Interpret Dream"}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
