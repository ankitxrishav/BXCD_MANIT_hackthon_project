'use client';

import { useChat } from '@/context/ChatProvider';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BrainCircuit, TrendingUp, Smile, Meh, Frown } from 'lucide-react';
import { cn } from '@/lib/utils';

const EmotionIcon = ({ emotion }: { emotion: string }) => {
  const lowerEmotion = emotion.toLowerCase();
  if (lowerEmotion.includes('joy') || lowerEmotion.includes('positive') || lowerEmotion.includes('happy')) {
    return <Smile className="h-6 w-6 text-green-500" />;
  }
  if (lowerEmotion.includes('sadness') || lowerEmotion.includes('negative') || lowerEmotion.includes('anger')) {
    return <Frown className="h-6 w-6 text-red-500" />;
  }
  return <Meh className="h-6 w-6 text-yellow-500" />;
};

export default function MoodAnalysis() {
  const { latestSentiment, moodSummary } = useChat();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Mood Analysis</CardTitle>
        <CardDescription>
          A real-time analysis of your mood based on the current conversation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {latestSentiment ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <EmotionIcon emotion={latestSentiment.emotion} />
                    <p className="text-xl font-bold capitalize">{latestSentiment.emotion}</p>
                </div>
            </div>
            {moodSummary && (
                <div className="flex items-start gap-4 pt-4">
                <BrainCircuit className="h-8 w-8 text-accent-foreground/80 mt-1 shrink-0" />
                <p className="text-foreground/90 italic">
                    {moodSummary}
                </p>
                </div>
            )}
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center text-center text-muted-foreground">
            <div>
              <p>No mood data available yet.</p>
              <p className="text-sm">
                Start a chat to see your mood analysis here.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
