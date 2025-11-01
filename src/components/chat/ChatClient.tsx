
'use client';

import { useState } from 'react';
import type { ChatMessage as ChatMessageType } from '@/lib/types';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { getPersonalizedRecommendation } from '@/ai/flows/personalized-recommendations';
import { analyzeSentiment } from '@/ai/flows/sentiment-analysis';
import { useChat } from '@/context/ChatProvider';
import { summarizeSentimentAnalysis } from '@/ai/flows/summarize-sentiment-analysis';
import SuggestedTopics from './SuggestedTopics';
import { useAuth } from '@/hooks/use-auth.tsx';
import { v4 as uuidv4 } from 'uuid';

export default function ChatClient() {
  const { userProfile } = useAuth();
  const { 
    messages, 
    addMessage, 
    activeSessionId, 
    updateMessage, 
    setMoodSummary, 
    setSuggestions, 
    latestSentiment, // Added here
    setLatestSentiment, 
    addMoodEntry
  } = useChat();
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading || !userProfile || !activeSessionId) return;

    setIsLoading(true);
    
    // 1. Optimistically add user message to UI
    const userMessageId = uuidv4();
    const userMessage: ChatMessageType = {
      id: userMessageId,
      role: 'user',
      text,
      userId: userProfile.uid,
      timestamp: new Date(),
    };
    // This is a temporary local update for responsiveness. The provider will get the canonical version from Firestore.
    // We add this to the messages array in the AI call to ensure context is up-to-date.


    try {
      // 2. Add user message to Firestore
      await addMessage(userMessage, userProfile.uid);

      // 3. Analyze sentiment and get a recommendation in parallel
      const [sentimentResult, recommendationResult] = await Promise.all([
        analyzeSentiment({ text }),
        getPersonalizedRecommendation({
          emotion: latestSentiment?.emotion || 'neutral', // Use previous emotion for context
          conversationContext: [...messages, userMessage]
            .slice(-5)
            .map(m => `${m.role}: ${m.text}`)
            .join('\n'),
        })
      ]);
      
      const currentSentiment = {
          emotion: sentimentResult.emotion,
          score: sentimentResult.sentimentScore
      };

      setLatestSentiment(currentSentiment);
      addMoodEntry(currentSentiment);
      
      // Update the user's message with the detected sentiment
      updateMessage(activeSessionId, userMessageId, { sentiment: currentSentiment });

      const primaryResponse = recommendationResult.recommendations[0] || "I'm here to listen. How can I help?";

      // 4. Add assistant's message to Firestore
      const assistantMessage: Omit<ChatMessageType, 'id'|'timestamp'> = {
        role: 'assistant',
        text: primaryResponse,
        userId: 'assistant',
      };
      await addMessage(assistantMessage, 'assistant');

      // 5. Update dashboard UI elements
      const sentimentData = [...messages, { ...userMessage, sentiment: currentSentiment }]
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
