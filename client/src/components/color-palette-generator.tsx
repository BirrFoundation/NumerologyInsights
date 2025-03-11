import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import type { NumerologyResult } from "@shared/schema";

interface Props {
  result: NumerologyResult;
  currentMood?: string;
}

type NumberToHue = {
  [key: number]: number;
};

type MoodToColor = {
  [key: string]: {
    saturation: number;
    lightness: number;
  };
};

// Map numerology numbers to base hues
const numberToHue: NumberToHue = {
  1: 0, // Red
  2: 210, // Blue
  3: 60, // Yellow
  4: 120, // Green
  5: 270, // Purple
  6: 330, // Pink
  7: 180, // Cyan
  8: 30, // Orange
  9: 300, // Magenta
  11: 45, // Golden
  22: 165, // Turquoise
  33: 315, // Fuchsia
  44: 200  // Ocean Blue
};

// Map moods to color properties
const moodToColor: MoodToColor = {
  "Joyful": { saturation: 80, lightness: 65 },
  "Calm": { saturation: 40, lightness: 70 },
  "Energetic": { saturation: 90, lightness: 60 },
  "Reflective": { saturation: 30, lightness: 50 },
  "Creative": { saturation: 70, lightness: 65 },
  "Focused": { saturation: 60, lightness: 45 },
  "Peaceful": { saturation: 35, lightness: 75 }
};

export default function ColorPaletteGenerator({ result, currentMood = "Calm" }: Props) {
  const [baseHue, setBaseHue] = useState(numberToHue[result.lifePath as keyof NumberToHue] || 0);
  const [saturation, setSaturation] = useState(moodToColor[currentMood]?.saturation || 50);
  const [lightness, setLightness] = useState(moodToColor[currentMood]?.lightness || 50);
  const [palette, setPalette] = useState<string[]>([]);

  useEffect(() => {
    // Update base color when mood changes
    if (moodToColor[currentMood]) {
      setSaturation(moodToColor[currentMood].saturation);
      setLightness(moodToColor[currentMood].lightness);
    }
  }, [currentMood]);

  useEffect(() => {
    // Generate harmonious palette
    const generatePalette = () => {
      const analogous1 = (baseHue + 30) % 360;
      const analogous2 = (baseHue - 30 + 360) % 360;
      const complementary = (baseHue + 180) % 360;
      const triadic1 = (baseHue + 120) % 360;

      return [
        `hsl(${baseHue}, ${saturation}%, ${lightness}%)`,
        `hsl(${analogous1}, ${saturation}%, ${lightness}%)`,
        `hsl(${analogous2}, ${saturation}%, ${lightness}%)`,
        `hsl(${complementary}, ${saturation - 10}%, ${lightness}%)`,
        `hsl(${triadic1}, ${saturation - 5}%, ${lightness + 5}%)`
      ];
    };

    setPalette(generatePalette());
  }, [baseHue, saturation, lightness]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Your Numerology Color Palette
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-4 mb-6">
          {palette.map((color, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 rounded-lg cursor-pointer relative group"
              style={{ backgroundColor: color }}
              whileHover={{ scale: 1.05 }}
              title={`Color ${index + 1}`}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 rounded-lg transition-opacity">
                <span className="text-white text-sm font-mono">{color}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Base Color (Hue)</label>
            <Slider
              value={[baseHue]}
              onValueChange={(value) => setBaseHue(value[0])}
              max={360}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Vibrancy (Saturation)</label>
            <Slider
              value={[saturation]}
              onValueChange={(value) => setSaturation(value[0])}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Brightness (Lightness)</label>
            <Slider
              value={[lightness]}
              onValueChange={(value) => setLightness(value[0])}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          <p>
            Your Life Path number {result.lifePath} influences your base color.
            Current mood "{currentMood}" affects the palette's energy.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}