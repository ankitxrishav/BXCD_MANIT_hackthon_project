'use client';

import { useChat } from '@/context/ChatProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, Smile, Meh, Frown, Sparkles } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

const EmotionIcon = ({ emotion, className }: { emotion: string, className?: string }) => {
  if (!emotion) return <Meh className={className} />;
  const lowerEmotion = emotion.toLowerCase();
  if (lowerEmotion.includes('joy') || lowerEmotion.includes('positive') || lowerEmotion.includes('happy')) {
    return <Smile className={className} />;
  }
  if (lowerEmotion.includes('sadness') || lowerEmotion.includes('negative') || lowerEmotion.includes('anger') || lowerEmotion.includes('fear')) {
    return <Frown className={className} />;
  }
  return <Meh className={className} />;
};


export default function SuggestedTopics() {
  const { suggestions, latestSentiment, isLoading } = useChat();

  const displaySuggestions = suggestions.length > 1 
    ? suggestions.slice(1) 
    : ['Mindfulness', 'Sleep Improvement', 'Coping Strategies'];

  const hasRealSuggestions = suggestions.length > 1;

  return (
    <div className="space-y-6">
        <Card className="rounded-xl shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">Current Mood</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading && !latestSentiment ? (
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-6 w-24" />
                    </div>
                ) : latestSentiment ? (
                    <div className="flex items-center gap-3 rounded-lg p-3 -m-3">
                        <EmotionIcon emotion={latestSentiment.emotion} className="h-8 w-8" />
                        <p className="text-xl font-bold capitalize">{latestSentiment.emotion}</p>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground pt-2">Your mood will appear here as you chat.</p>
                )}
            </CardContent>
        </Card>
        
        <Card className="rounded-xl shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg">AI Suggestions</CardTitle>
                <CardDescription>Tips from your AI companion.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {isLoading && !hasRealSuggestions ? (
                    <>
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </>
                ) : (
                    <>
                        {displaySuggestions.map((suggestion, index) => (
                            <Button key={index} variant="outline" className="w-full justify-start gap-3 h-auto text-left py-2">
                                {hasRealSuggestions ? <Lightbulb className="h-4 w-4 mt-1 flex-shrink-0" /> : <Sparkles className="h-4 w-4 mt-1 flex-shrink-0" />}
                                <span className="whitespace-normal leading-snug">{suggestion}</span>
                            </Button>
                        ))}
                        {!hasRealSuggestions && (
                            <p className="text-xs text-muted-foreground text-center pt-2">Actionable suggestions will appear here based on your conversation.</p>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
