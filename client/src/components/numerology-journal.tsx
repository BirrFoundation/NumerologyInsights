import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import type { NumerologyResult } from "@shared/schema";

interface JournalEntry {
  date: string;
  mood: string;
  reflection: string;
  prompt: string;
}

interface Props {
  result: NumerologyResult;
}

export default function NumerologyJournal({ result }: Props) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<JournalEntry>({
    date: format(new Date(), 'yyyy-MM-dd'),
    mood: '',
    reflection: '',
    prompt: ''
  });

  // Generate prompts based on numerology numbers
  const getReflectionPrompts = (): string[] => {
    const prompts = [
      `How did you express your Life Path ${result.lifePath} energy today?`,
      `In what ways did your Expression number ${result.expression} manifest in your interactions?`,
      `Reflect on how your Heart's Desire number ${result.heartDesire} influenced your choices today.`,
      `How did your Personality number ${result.personality} affect your approach to challenges?`,
      `What spiritual insights did you gain today, considering your Destiny number ${result.destiny}?`
    ];

    // Add master number specific prompts if applicable
    if ([11, 22, 33, 44].includes(result.lifePath)) {
      prompts.push(
        `How did you balance the spiritual and material aspects of your master number ${result.lifePath}?`,
        `What higher guidance did you receive through your master number today?`
      );
    }

    return prompts;
  };

  const handleSaveEntry = () => {
    if (!currentEntry.mood || !currentEntry.reflection) return;

    setEntries(prev => [...prev, currentEntry]);
    setCurrentEntry({
      date: format(new Date(), 'yyyy-MM-dd'),
      mood: '',
      reflection: '',
      prompt: ''
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-light">Numerology Journal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Date</label>
            <Input
              type="date"
              value={currentEntry.date}
              onChange={(e) => setCurrentEntry(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Mood</label>
            <Select
              value={currentEntry.mood}
              onValueChange={(value) => setCurrentEntry(prev => ({ ...prev, mood: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="How are you feeling?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inspired">✨ Inspired</SelectItem>
                <SelectItem value="balanced">⚖️ Balanced</SelectItem>
                <SelectItem value="challenged">🎯 Challenged</SelectItem>
                <SelectItem value="reflective">🤔 Reflective</SelectItem>
                <SelectItem value="energetic">⚡ Energetic</SelectItem>
                <SelectItem value="peaceful">🕊️ Peaceful</SelectItem>
                <SelectItem value="uncertain">❓ Uncertain</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Today's Reflection Prompt</label>
          <Select
            value={currentEntry.prompt}
            onValueChange={(value) => setCurrentEntry(prev => ({ ...prev, prompt: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a reflection prompt..." />
            </SelectTrigger>
            <SelectContent>
              {getReflectionPrompts().map((prompt, index) => (
                <SelectItem key={index} value={prompt}>
                  {prompt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Your Reflection</label>
          <Textarea
            placeholder="Write your thoughts here..."
            className="mt-2"
            value={currentEntry.reflection}
            onChange={(e) => setCurrentEntry(prev => ({ ...prev, reflection: e.target.value }))}
            rows={6}
          />
        </div>

        <Button
          onClick={handleSaveEntry}
          className="w-full"
          disabled={!currentEntry.mood || !currentEntry.reflection}
        >
          Save Journal Entry
        </Button>

        {entries.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Previous Entries</h3>
            <div className="space-y-4">
              {entries.map((entry, index) => (
                <Card key={index} className="bg-muted/50">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(entry.date), 'MMMM d, yyyy')}
                      </div>
                      <div className="text-sm font-medium">{entry.mood}</div>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Prompt: {entry.prompt}
                    </div>
                    <div className="text-sm whitespace-pre-wrap">
                      {entry.reflection}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}