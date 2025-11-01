
'use client';

import { useState, useEffect } from 'react';
import type { ChatMessage as ChatMessageType } from '@/lib/types';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { getPersonalizedRecommendation } from '@/ai/flows/personalized-recommendations';
import { analyzeSentiment } from '@/ai/flows/sentiment-analysis';
import { useChat } from '@/context/ChatProvider';

export default function ChatClient() {
  const { messages, addMessage, startNewSession } = useChat();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If there are no messages, start a new session with an initial message.
    if (messages.length === 0) {
      startNewSession('Hello! How are you feeling today?');
    }
  }, [messages.length, startNewSession]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessageType = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setIsLoading(true);

    try {
      // Analyze sentiment and get a recommendation
      const sentimentResult = await analyzeSentiment({ text });
      
      const conversationContext = [...messages, userMessage]
        .slice(-5)
        .map(m => `${m.role}: ${m.text}`)
        .join('\n');

      const recommendationResult = await getPersonalizedRecommendation({
        emotion: sentimentResult.emotion,
        conversationContext,
      });

      const assistantMessage: ChatMessageType = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: recommendationResult.recommendation,
        timestamp: new Date(),
        sentiment: {
          score: sentimentResult.sentimentScore,
          emotion: sentimentResult.emotion,
        },
      };

      addMessage(assistantMessage);

    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: ChatMessageType = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      addMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <ChatMessages messages={messages} isLoading={isLoading} />
      <div className="border-t p-4 bg-background">
        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  );
}
