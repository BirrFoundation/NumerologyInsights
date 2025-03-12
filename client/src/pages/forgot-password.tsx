import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const requestResetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const resetPasswordSchema = z.object({
  code: z.string().min(6, "Please enter the complete verification code"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export default function ForgotPasswordPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"request" | "reset">("request");
  const [userId, setUserId] = useState<number | null>(null);

  const requestForm = useForm({
    resolver: zodResolver(requestResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetForm = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      code: "",
      newPassword: "",
    },
  });

  const requestResetMutation = useMutation({
    mutationFn: async (data: { email: string }) => {
      setIsLoading(true);
      const response = await apiRequest("POST", "/api/auth/forgot-password", data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to request password reset");
      }
      return response.json();
    },
    onSuccess: (data) => {
      setUserId(data.userId);
      setStep("reset");
      toast({
        title: "Reset code sent",
        description: "Please check your email for the reset code.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Failed to send reset code",
        description: error.message,
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: { code: string; newPassword: string }) => {
      if (!userId) throw new Error("User ID not found");
      setIsLoading(true);
      const response = await apiRequest("POST", "/api/auth/reset-password", {
        userId,
        ...data,
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to reset password");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Password reset successful",
        description: "You can now log in with your new password.",
      });
      setLocation("/login");
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Failed to reset password",
        description: error.message,
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const onRequestSubmit = (data: { email: string }) => {
    requestResetMutation.mutate(data);
  };

  const onResetSubmit = (data: { code: string; newPassword: string }) => {
    resetPasswordMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-primary/5">
      <div className="w-full max-w-md space-y-8 p-8 bg-background/95 backdrop-blur-sm border border-primary/20 rounded-xl">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Reset Password</h2>
          <p className="text-sm text-muted-foreground mt-2">
            {step === "request"
              ? "Enter your email to receive a reset code"
              : "Enter the code sent to your email"}
          </p>
        </div>

        {step === "request" ? (
          <Form {...requestForm}>
            <form onSubmit={requestForm.handleSubmit(onRequestSubmit)} className="space-y-6">
              <FormField
                control={requestForm.control}
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className="w-full"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Code"}
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...resetForm}>
            <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-6">
              <FormField
                control={resetForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        value={field.value}
                        onChange={field.onChange}
                        render={({ slots }) => (
                          <InputOTPGroup>
                            {slots.map((slot, index) => (
                              <InputOTPSlot key={index} {...slot} />
                            ))}
                          </InputOTPGroup>
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={resetForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your new password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className="w-full"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </Form>
        )}

        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Remember your password?{" "}
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
