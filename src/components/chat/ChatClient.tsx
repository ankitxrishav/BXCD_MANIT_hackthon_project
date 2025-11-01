
'use client';

import { useState } from 'react';
import type { ChatMessage as ChatMessageType, Sentiment } from '@/lib/types';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { getPersonalizedRecommendation } from '@/ai/flows/personalized-recommendations';
import { analyzeSentiment } from '@/ai/flows/sentiment-analysis';
import { useChat } from '@/context/ChatProvider';
import { summarizeSentimentAnalysis } from '@/ai/flows/summarize-sentiment-analysis';
import SuggestedTopics from './SuggestedTopics';
import { useAuth } from '@/hooks/use-auth.tsx';

export default function ChatClient() {
  const { userProfile } = useAuth();
  const { 
    messages, 
    addMessage, 
    activeSessionId, 
    setMoodSummary, 
    setSuggestions,
    latestSentiment,
    setLatestSentiment, 
    addMoodEntry
  } = useChat();
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading || !userProfile || !activeSessionId) return;

    setIsLoading(true);
    
    const userMessage: Omit<ChatMessageType, 'id' | 'timestamp'> = {
      role: 'user',
      text,
      userId: userProfile.uid,
    };

    try {
      // Analyze sentiment first
      const sentimentResult = await analyzeSentiment({ text });
      
      const currentSentiment: Sentiment = {
          emotion: sentimentResult.emotion,
          score: sentimentResult.sentimentScore
      };

      // Add user message to Firestore with sentiment in one go
      await addMessage(userMessage, userProfile.uid, currentSentiment);

      // Now update local state and fetch recommendations
      setLatestSentiment(currentSentiment);
      addMoodEntry(currentSentiment);

      // Get recommendation using previous emotion for better context
      const recommendationResult = await getPersonalizedRecommendation({
        emotion: latestSentiment?.emotion || 'neutral',
        conversationContext: [...messages, { ...userMessage, id: '', timestamp: new Date() }] // Create a temporary message for context
          .slice(-5)
          .map(m => `${m.role}: ${m.text}`)
          .join('\n'),
      });

      const primaryResponse = recommendationResult.recommendations[0] || "I'm here to listen. How can I help?";

      // Add assistant's message to Firestore
      const assistantMessage: Omit<ChatMessageType, 'id'|'timestamp'> = {
        role: 'assistant',
        text: primaryResponse,
        userId: 'assistant',
      };
      await addMessage(assistantMessage, 'assistant');

      // Update dashboard UI elements
      const sentimentData = [...messages, { ...userMessage, id: '', timestamp: new Date(), sentiment: currentSentiment }]
        .filter(m => m.sentiment)
        .map(m => ({ emotion: m.sentiment!.emotion, score: m.sentiment!.score, text: m.text }));
      
      if (sentimentData.length > 2) { // Summarize after a few exchanges
        const summaryResult = await summarizeSentimentAnalysis({ sentimentData: JSON.stringify(sentimentData) });
        setMoodSummary(summaryResult.summary);
      }

      setSuggestions(recommendationResult.recommendations);

    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Omit<ChatMessageType, 'id'|'timestamp'> = {
        role: 'assistant',
        text: 'Sorry, I encountered an error. Please try again.',
        userId: 'assistant',
      };
      await addMessage(errorMessage, 'assistant');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start p-6">
        <div className="md:col-span-2 flex flex-1 flex-col overflow-hidden rounded-xl border bg-card/80 backdrop-blur-xl shadow-lg h-[calc(80vh-3rem)]">
            <ChatMessages messages={messages} isLoading={isLoading} />
            <div className="border-t p-4 bg-background/50">
                <ChatInput onSend={handleSend} isLoading={isLoading} />
            </div>
        </div>
        <div className="md:col-span-1">
            <SuggestedTopics />
        </div>
    </div>
  );
}
