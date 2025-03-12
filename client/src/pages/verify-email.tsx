import { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const verifyEmailSchema = z.object({
  code: z.string().min(6, "Please enter the complete verification code"),
});

export default function VerifyEmailPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [email, setEmail] = useState<string>("");
  const [emailSent, setEmailSent] = useState<boolean>(true);

  useEffect(() => {
    // Get userId and email from URL params
    const params = new URLSearchParams(window.location.search);
    const id = params.get("userId");
    const emailParam = params.get("email");
    const emailSentParam = params.get("emailSent");

    if (id && emailParam) {
      setUserId(parseInt(id));
      setEmail(emailParam);
      setEmailSent(emailSentParam === "true");

      // Only request verification code automatically if email wasn't sent during signup
      if (emailSentParam === "false") {
        requestVerificationCode(parseInt(id));
      }
    } else {
      setLocation("/login");
    }
  }, []);

  const form = useForm({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      code: "",
    },
  });

  const requestVerificationCode = async (userId: number) => {
    try {
      setIsLoading(true);
      console.log("Requesting verification code for userId:", userId);
      const response = await apiRequest("POST", "/api/auth/resend-verification", { userId });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send verification code");
      }

      if (data.emailSent) {
        toast({
          title: "Verification code sent",
          description: "Please check your email for the verification code.",
        });
        setEmailSent(true);
      } else {
        throw new Error("Failed to send email. Please try again in a few minutes.");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to send code",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
      setEmailSent(false);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmailMutation = useMutation({
    mutationFn: async (data: { code: string }) => {
      if (!userId) throw new Error("User ID not found");
      setIsLoading(true);
      console.log("Verifying email with:", { userId, code: data.code });
      const response = await apiRequest("POST", "/api/auth/verify-email", {
        userId,
        code: data.code,
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to verify email");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Email verified",
        description: "Your email has been verified successfully.",
      });
      setLocation("/login");
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: error.message,
      });
      setIsLoading(false);
    },
  });

  const onSubmit = (data: { code: string }) => {
    verifyEmailMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-primary/5">
      <div className="w-full max-w-md space-y-8 p-8 bg-background/95 backdrop-blur-sm border border-primary/20 rounded-xl">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Verify Your Email</h2>
          <p className="text-sm text-muted-foreground mt-2">
            {emailSent
              ? `Enter the verification code sent to ${email}`
              : "Click below to send a verification code to your email"
            }
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
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

            <Button
              className="w-full"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            {emailSent ? "Didn't receive the code? " : ""}
            <Button
              variant="link"
              className="p-0 h-auto font-normal"
              onClick={() => userId && requestVerificationCode(userId)}
              disabled={isLoading}
            >
              {emailSent ? "Resend code" : "Send verification code"}
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}