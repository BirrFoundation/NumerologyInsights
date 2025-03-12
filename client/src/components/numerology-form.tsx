import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { numerologyInputSchema, type NumerologyResult } from "@shared/schema";
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";

interface Props {
  onResult: (result: NumerologyResult) => void;
}

export default function NumerologyForm({ onResult }: Props) {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(numerologyInputSchema),
    defaultValues: {
      name: "",
      birthdate: new Date().toISOString().split('T')[0]
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: { name: string; birthdate: string }) => {
      try {
        const res = await apiRequest("POST", "/api/calculate", data);
        const result = await res.json();
        return result;
      } catch (error: any) {
        const message = await error.response?.json()
          .then((data: any) => data.message)
          .catch(() => null);
        throw new Error(message || error.message || "Failed to calculate numerology");
      }
    },
    onSuccess: (data) => {
      onResult(data);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to calculate numerology. Please try again."
      });
    }
  });

  const onSubmit = async (data: { name: string; birthdate: string }) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto py-4 sm:py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">Begin Your Numerological Journey</h2>
        <p className="text-muted-foreground">
          Enter your details below to discover your cosmic numerology profile
        </p>
      </div>

      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)} 
          className="space-y-6 w-full px-4 sm:px-0"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-center block">Full Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your full name" 
                    {...field} 
                    className="text-center"
                  />
                </FormControl>
                <FormDescription className="text-center">
                  Enter your full name as it appears on your birth certificate
                </FormDescription>
                <FormMessage className="text-center" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthdate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-center block">Birth Date</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field}
                    className="text-center"
                  />
                </FormControl>
                <FormDescription className="text-center">
                  Select your date of birth
                </FormDescription>
                <FormMessage className="text-center" />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Calculating...
              </>
            ) : mutation.isError ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </>
            ) : (
              "Calculate Numerology"
            )}
          </Button>

          {Object.keys(form.formState.errors).length > 0 && (
            <div className="text-sm text-red-500 mt-2 text-center">
              <p>Please fix the following errors:</p>
              <ul className="list-none mt-1">
                {Object.entries(form.formState.errors).map(([field, error]) => (
                  <li key={field}>{error?.message}</li>
                ))}
              </ul>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}