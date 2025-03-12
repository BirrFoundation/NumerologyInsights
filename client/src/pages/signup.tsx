import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userAuthSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function SignupPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(userAuthSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/signup", data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create account');
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Account created successfully",
        description: "Please check your email to verify your account.",
      });
      // Redirect to email verification page with userId and email
      setLocation(`/verify-email?userId=${data.userId}&email=${encodeURIComponent(form.getValues().email)}`);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Failed to create account",
        description: error.message,
      });
      setIsLoading(false);
    },
  });

  const onSubmit = (data: { email: string; password: string }) => {
    setIsLoading(true);
    signupMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-primary/5">
      <div className="w-full max-w-md space-y-8 p-8 bg-background/95 backdrop-blur-sm border border-primary/20 rounded-xl">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Create account</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Enter your details to start your numerological journey
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    We'll send you a verification email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Create a password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Must be at least 8 characters with numbers and letters.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="w-full"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <Button
              variant="link"
              className="p-0 h-auto font-normal"
              onClick={() => setLocation("/login")}
            >
              Sign in
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}