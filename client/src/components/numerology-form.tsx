import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertNumerologySchema, type NumerologyResult } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Props {
  onResult: (result: NumerologyResult) => void;
}

export default function NumerologyForm({ onResult }: Props) {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(insertNumerologySchema),
    defaultValues: {
      name: "",
      birthdate: ""
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: { name: string; birthdate: string }) => {
      const res = await apiRequest("POST", "/api/calculate", data);
      return res.json();
    },
    onSuccess: (data) => {
      onResult(data);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to calculate numerology. Please try again."
      });
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} 
            className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="birthdate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birth Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Calculating...
            </>
          ) : (
            "Calculate Numerology"
          )}
        </Button>
      </form>
    </Form>
  );
}
