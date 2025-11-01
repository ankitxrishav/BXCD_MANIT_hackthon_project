'use client';

import { useState, useEffect } from 'react';
import { ChatMessage as ChatMessageType, UserProfile } from '@/lib/types';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { getPersonalizedRecommendation } from '@/ai/flows/personalized-recommendations';
import { analyzeSentiment } from '@/ai/flows/sentiment-analysis';
import { useChat } from '@/context/ChatProvider';
import { summarizeSentimentAnalysis } from '@/ai/flows/summarize-sentiment-analysis';
import SuggestedTopics from './SuggestedTopics';
import { useAuth } from '@/hooks/use-auth';

export default function ChatClient() {
  const { userProfile } = useAuth();
  const { messages, addMessage, startNewSession, setMoodSummary, setSuggestions, setLatestSentiment } = useChat();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If there are no messages, start a new session with an initial message.
    if (messages.length === 0 && userProfile) {
      startNewSession('Hello! How are you feeling today?');
    }
  }, [messages.length, startNewSession, userProfile]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading || !userProfile) return;

    const userMessage: ChatMessageType = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date(),
      userId: userProfile.uid,
    };

    addMessage(userMessage);
    setIsLoading(true);

    try {
      const allMessages = [...messages, userMessage];
      // Analyze sentiment and get a recommendation
      const sentimentResult = await analyzeSentiment({ text });
      
      setLatestSentiment({
          emotion: sentimentResult.emotion,
          score: sentimentResult.sentimentScore
      });

      const conversationContext = allMessages
        .slice(-5)
        .map(m => `${m.role}: ${m.text}`)
        .join('\n');

      const recommendationResult = await getPersonalizedRecommendation({
        emotion: sentimentResult.emotion,
        conversationContext,
      });
      
      const primaryResponse = recommendationResult.recommendations[0] || "I'm not sure what to say, but I'm here to listen.";

      const assistantMessage: ChatMessageType = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: primaryResponse,
        timestamp: new Date(),
        userId: 'assistant',
        sentiment: {
          score: sentimentResult.sentimentScore,
          emotion: sentimentResult.emotion,
        },
      };

      addMessage(assistantMessage);

      // Update dashboard after response
      const sentimentData = allMessages
        .filter(m => m.sentiment)
        .map(m => ({ emotion: m.sentiment!.emotion, score: m.sentiment!.score, text: m.text }));
      
      if (sentimentData.length > 0) {
        const summaryResult = await summarizeSentimentAnalysis({ sentimentData: JSON.stringify(sentimentData) });
        setMoodSummary(summaryResult.summary);
      }

      setSuggestions(recommendationResult.recommendations);

    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: ChatMessageType = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        userId: 'assistant',
      };
      addMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2 flex flex-1 flex-col overflow-hidden rounded-xl border bg-card shadow-sm h-[70vh]">
            <ChatMessages messages={messages} isLoading={isLoading} />
            <div className="border-t p-4 bg-background">
                <ChatInput onSend={handleSend} isLoading={isLoading} />
            </div>
        </div>
        <div className="md:col-span-1">
            <SuggestedTopics />
        </div>
    </div>
  );
}
