'use client';

import { useChat } from '@/context/ChatProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, Smile, Meh, Frown } from 'lucide-react';

const EmotionIcon = ({ emotion }: { emotion: string }) => {
  if (!emotion) return <Meh className="h-6 w-6 text-yellow-500" />;
  const lowerEmotion = emotion.toLowerCase();
  if (lowerEmotion.includes('joy') || lowerEmotion.includes('positive') || lowerEmotion.includes('happy')) {
    return <Smile className="h-6 w-6 text-green-500" />;
  }
  if (lowerEmotion.includes('sadness') || lowerEmotion.includes('negative') || lowerEmotion.includes('anger') || lowerEmotion.includes('fear')) {
    return <Frown className="h-6 w-6 text-red-500" />;
  }
  return <Meh className="h-6 w-6 text-yellow-500" />;
};


export default function SuggestedTopics() {
  const { suggestions, latestSentiment } = useChat();

  // If we have more than one suggestion, show the rest. Otherwise, show default topics.
  const displaySuggestions = suggestions.length > 1 
    ? suggestions.slice(1) 
    : ['Mindfulness', 'Sleep Improvement', 'Coping Strategies'];

  const hasRealSuggestions = suggestions.length > 1;

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle>AI Suggestions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {latestSentiment && (
            <div className="space-y-2 p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                    <EmotionIcon emotion={latestSentiment.emotion} />
                    <p className="font-bold capitalize">{latestSentiment.emotion}</p>
                </div>
            </div>
        )}
        <div className="space-y-2">
            {displaySuggestions.map((suggestion, index) => (
                <Button key={index} variant="outline" className="w-full justify-start gap-3 h-auto text-left">
                    <Lightbulb className="h-4 w-4 mt-1 flex-shrink-0" />
                    <span className="whitespace-normal">{suggestion}</span>
                </Button>
            ))}
             {!hasRealSuggestions && (
                <p className="text-sm text-muted-foreground text-center pt-2">Suggestions will appear here as you chat.</p>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
