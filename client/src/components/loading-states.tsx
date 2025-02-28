import { motion } from "framer-motion";
import { Loader2, Sparkles, Brain, Cpu } from "lucide-react";

interface LoadingStateProps {
  type?: "ai" | "processing" | "analysis";
  message?: string;
}

export function LoadingState({ type = "ai", message }: LoadingStateProps) {
  const Icon = type === "ai" ? Sparkles : 
              type === "processing" ? Cpu : 
              Brain;

  const defaultMessage = type === "ai" ? "AI is thinking..." :
                        type === "processing" ? "Processing your request..." :
                        "Analyzing numerology patterns...";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col items-center justify-center p-6 space-y-4"
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
        className="relative"
      >
        <Icon className="w-8 h-8 text-primary" />
        <motion.div
          animate={{
            opacity: [0, 1, 0],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 rounded-full bg-primary/20"
        />
      </motion.div>
      <motion.div
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="text-sm text-muted-foreground"
      >
        {message || defaultMessage}
      </motion.div>
    </motion.div>
  );
}

export function SpinnerOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <Loader2 className="w-6 h-6 text-primary" />
      </motion.div>
    </motion.div>
  );
}
