import { motion } from "framer-motion";
import { Loader2, Sparkles, Brain, Cpu, Calculator } from "lucide-react";
import { Card } from "./ui/card";

interface LoadingStateProps {
  type?: "ai" | "processing" | "analysis" | "calculation";
  message?: string;
}

export function LoadingState({ type = "ai", message }: LoadingStateProps) {
  const Icon = type === "ai" ? Sparkles : 
              type === "processing" ? Cpu : 
              type === "calculation" ? Calculator :
              Brain;

  const defaultMessage = type === "ai" ? "AI is calculating your cosmic patterns..." :
                        type === "processing" ? "Processing your celestial data..." :
                        type === "calculation" ? "Calculating numerological harmonies..." :
                        "Analyzing numerology patterns...";

  return (
    <Card className="p-8 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="flex flex-col items-center justify-center space-y-6"
      >
        {/* Main icon with cosmic glow */}
        <motion.div
          className="relative"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Icon className="w-12 h-12 text-primary relative z-10" />

          {/* Cosmic particle effects */}
          <motion.div
            className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Rotating rings */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 border border-primary/30 rounded-full"
              animate={{
                rotate: [0, 360],
                scale: [1 + i * 0.1, 1.2 + i * 0.1, 1 + i * 0.1],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </motion.div>

        {/* Message with sparkle effect */}
        <motion.div
          className="text-center space-y-2"
          animate={{
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <p className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            {message || defaultMessage}
          </p>
          <p className="text-sm text-muted-foreground">
            Aligning with cosmic frequencies...
          </p>
        </motion.div>

        {/* Cosmic particles background */}
        <div className="absolute inset-0 -z-10">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.div>
    </Card>
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
        className="relative"
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <Loader2 className="w-8 h-8 text-primary" />
        {/* Cosmic trail effect */}
        <motion.div
          className="absolute inset-0 bg-primary/20 rounded-full blur-md"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </motion.div>
  );
}