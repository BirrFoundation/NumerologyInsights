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
import { useEffect } from "react";

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

  // Debug form state
  useEffect(() => {
    console.log('Form state:', {
      values: form.getValues(),
      errors: form.formState.errors,
      isValid: form.formState.isValid,
      isDirty: form.formState.isDirty
    });
  }, [form.formState]);

  const mutation = useMutation({
    mutationFn: async (data: { name: string; birthdate: string }) => {
      try {
        console.log('Attempting to submit:', data);
        const res = await apiRequest("POST", "/api/calculate", data);
        const result = await res.json();
        console.log('Calculation result:', result);
        return result;
      } catch (error: any) {
        console.error('Calculation error:', error);
        // Get the error message from the response if available
        const message = await error.response?.json()
          .then((data: any) => data.message)
          .catch(() => null);
        throw new Error(message || error.message || "Failed to calculate numerology");
      }
    },
    onSuccess: (data) => {
      console.log('Calculation succeeded:', data);
      onResult(data);
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to calculate numerology. Please try again."
      });
    }
  });

  const onSubmit = async (data: { name: string; birthdate: string }) => {
    console.log('Form submitted with:', data);
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your full name" 
                  {...field} 
                  onChange={(e) => {
                    console.log('Name changed:', e.target.value);
                    field.onChange(e);
                  }}
                />
              </FormControl>
              <FormDescription>
                Enter your full name as it appears on your birth certificate
              </FormDescription>
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
                <Input 
                  type="date" 
                  {...field}
                  onChange={(e) => {
                    console.log('Date changed:', e.target.value);
                    field.onChange(e);
                  }}
                />
              </FormControl>
              <FormDescription>
                Select your date of birth
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
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
          <div className="text-sm text-red-500 mt-2">
            <p>Please fix the following errors:</p>
            <ul className="list-disc pl-4">
              {Object.entries(form.formState.errors).map(([field, error]) => (
                <li key={field}>{error?.message}</li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </Form>
  );
}