'use client';

import { useChat } from '@/context/ChatProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, Zap, Smile, Meh, Frown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const EmotionIcon = ({ emotion }: { emotion: string }) => {
  if (!emotion) return <Meh className="h-6 w-6 text-yellow-500" />;
  const lowerEmotion = emotion.toLowerCase();
  if (lowerEmotion.includes('joy') || lowerEmotion.includes('positive')) {
    return <Smile className="h-6 w-6 text-green-500" />;
  }
  if (lowerEmotion.includes('sadness') || lowerEmotion.includes('negative')) {
    return <Frown className="h-6 w-6 text-red-500" />;
  }
  return <Meh className="h-6 w-6 text-yellow-500" />;
};


export default function SuggestedTopics() {
  const { suggestions, latestSentiment } = useChat();

  const confidence = latestSentiment ? Math.round(((latestSentiment.score + 1) / 2) * 100) : 0;

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle>Suggested Topics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {latestSentiment && (
            <div className="space-y-2 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <EmotionIcon emotion={latestSentiment.emotion} />
                        <p className="font-bold capitalize">{latestSentiment.emotion}</p>
                    </div>
                    <span className="text-sm font-semibold text-muted-foreground">{confidence}%</span>
                </div>
                <Progress value={confidence} className="h-2" />
            </div>
        )}
        <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
                <Button key={index} variant="outline" className="w-full justify-start gap-3">
                    <Lightbulb className="h-4 w-4" />
                    <span className="truncate">{suggestion}</span>
                </Button>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
