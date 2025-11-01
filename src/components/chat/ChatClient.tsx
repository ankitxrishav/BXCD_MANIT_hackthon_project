
'use client';

import { useState, useEffect } from 'react';
import type { ChatMessage } from '@/lib/types';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { getPersonalizedRecommendation } from '@/ai/flows/personalized-recommendations';
import { analyzeSentiment } from '@/ai/flows/sentiment-analysis';

export default function ChatClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    // Start with an initial message from the assistant
    setMessages([
      {
        id: 'initial-message',
        role: 'assistant',
        text: 'Hello! How are you feeling today?',
        timestamp: new Date(),
      },
    ]);
  }, []);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Get sentiment from the user's message
      const sentimentResult = await analyzeSentiment({ text });

      const conversationContext = [...messages, userMessage]
        .slice(-5)
        .map(m => `${m.role}: ${m.text}`)
        .join('\n');

      // Get a personalized recommendation
      const recommendationResult = await getPersonalizedRecommendation({
        emotion: sentimentResult.emotion,
        conversationContext: conversationContext,
      });

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: recommendationResult.recommendation,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
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
