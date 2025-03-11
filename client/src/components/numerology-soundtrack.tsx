import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import type { NumerologyResult } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  result: NumerologyResult;
}

const NOTE_FREQUENCIES = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
  G4: 392.00, A4: 440.00, B4: 493.88, C5: 523.25
};

const NUMEROLOGY_SCALES = {
  1: ["C4", "E4", "G4"],    // Major triad - leadership
  2: ["D4", "F4", "A4"],    // Minor triad - harmony
  3: ["E4", "G4", "B4"],    // Major triad - creativity
  4: ["F4", "A4", "C5"],    // Minor triad - stability
  5: ["G4", "B4", "D4"],    // Major triad - change
  6: ["A4", "C4", "E4"],    // Minor triad - balance
  7: ["B4", "D4", "F4"],    // Diminished - mysticism
  8: ["C5", "E4", "G4"],    // Major triad - power
  9: ["D4", "F4", "A4"],    // Minor triad - completion
  11: ["E4", "G4", "C5"],   // Suspended - mastery
  22: ["C4", "G4", "C5"],   // Perfect fifth - mastery
};

export function NumerologySoundtrack({ result }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodesRef = useRef<GainNode[]>([]);

  const createAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  };

  const stopSound = () => {
    oscillatorsRef.current.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // Oscillator might already be stopped
      }
    });
    oscillatorsRef.current = [];
    gainNodesRef.current = [];
  };

  const generateSound = () => {
    const audioContext = createAudioContext();
    stopSound();

    // Create base frequency from Life Path number
    const baseScale = NUMEROLOGY_SCALES[result.lifePath as keyof typeof NUMEROLOGY_SCALES] || NUMEROLOGY_SCALES[1];

    baseScale.forEach((note, index) => {
      const osc = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // Set frequency based on note
      osc.frequency.value = NOTE_FREQUENCIES[note as keyof typeof NOTE_FREQUENCIES];

      // Modify waveform based on Expression number
      osc.type = result.expression % 2 === 0 ? 'sine' : 'triangle';

      // Connect nodes
      osc.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Set volume
      gainNode.gain.value = isMuted ? 0 : volume * (0.2 - index * 0.05);

      // Start oscillator
      osc.start();

      // Add to refs for later cleanup
      oscillatorsRef.current.push(osc);
      gainNodesRef.current.push(gainNode);
    });
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopSound();
    } else {
      generateSound();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const value = newVolume[0];
    setVolume(value);
    gainNodesRef.current.forEach((gainNode, index) => {
      gainNode.gain.value = isMuted ? 0 : value * (0.2 - index * 0.05);
    });
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    gainNodesRef.current.forEach((gainNode, index) => {
      gainNode.gain.value = !isMuted ? 0 : volume * (0.2 - index * 0.05);
    });
  };

  useEffect(() => {
    return () => {
      stopSound();
    };
  }, []);

  return (
    <div className="p-6 rounded-xl bg-background/80 backdrop-blur-sm border border-primary/20">
      <h3 className="text-xl font-semibold mb-6">Your Numerological Soundtrack</h3>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={togglePlay}
              className="h-12 w-12"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="text-muted-foreground hover:text-foreground"
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>
              <div className="w-32">
                <Slider
                  value={[volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="[&_.slider-thumb]:h-3 [&_.slider-thumb]:w-3"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sound Visualization */}
        <div className="relative h-24 border rounded-lg overflow-hidden bg-background/50">
          <AnimatePresence>
            {isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center gap-1">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-primary"
                    initial={{ height: 20 }}
                    animate={{
                      height: [20, 60, 20],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>This unique sound pattern is generated from your numerological profile:</p>
          <ul className="list-disc pl-4 mt-2 space-y-1">
            <li>Base harmony from Life Path number {result.lifePath}</li>
            <li>Rhythm influenced by Expression number {result.expression}</li>
            <li>Harmonic structure based on Destiny number {result.destiny}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}