
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ChatMessage, ChatSession } from '@/lib/types';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { getPersonalizedRecommendation } from '@/ai/flows/personalized-recommendations';
import { analyzeSentiment } from '@/ai/flows/sentiment-analysis';
import { useAuth } from '@/hooks/use-auth';
import { useFirebase, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, serverTimestamp, doc, query, orderBy, limit } from 'firebase/firestore';
import {
  setDocumentNonBlocking,
  addDocumentNonBlocking,
  updateDocumentNonBlocking,
} from '@/firebase/non-blocking-updates';

const CHAT_SESSION_ID = 'current_chat';

export default function ChatClient() {
  const { user } = useAuth();
  const { firestore } = useFirebase();
  const [isLoading, setIsLoading] = useState(false);

  const chatSessionRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid, 'chatSessions', CHAT_SESSION_ID);
  }, [user, firestore]);

  const { data: chatSession } = useDoc<ChatSession>(chatSessionRef);

  const messagesRef = useMemoFirebase(() => {
    if (!chatSessionRef) return null;
    return query(collection(chatSessionRef, 'chatMessages'), orderBy('timestamp', 'asc'), limit(50));
  }, [chatSessionRef]);

  const { data: messages, isLoading: messagesLoading } = useCollection<ChatMessage>(messagesRef);

  const createSessionIfNeeded = useCallback(async () => {
    if (user && !chatSession && chatSessionRef) {
      const newSession = {
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        title: 'Current Session',
      };
      setDocumentNonBlocking(chatSessionRef, newSession, {});

      const initialMsgRef = collection(chatSessionRef, 'chatMessages');
      const initialMessage = {
        role: 'assistant' as const,
        text: 'Hello! How are you feeling today?',
        timestamp: serverTimestamp(),
      };
      addDocumentNonBlocking(initialMsgRef, initialMessage);
    }
  }, [user, chatSession, chatSessionRef]);

  useEffect(() => {
    createSessionIfNeeded();
  }, [createSessionIfNeeded]);

  const handleSend = async (text: string) => {
    if (!text.trim() || !user || !chatSessionRef) return;

    const userMessage: Omit<ChatMessage, 'id'> = {
      role: 'user',
      text,
      timestamp: serverTimestamp() as any,
    };

    setIsLoading(true);

    const messagesCollectionRef = collection(chatSessionRef, 'chatMessages');

    try {
      // This is the only part that needs to be awaited to get the doc ref
      const userMessageRef = await addDocumentNonBlocking(messagesCollectionRef, userMessage);
      if (!userMessageRef) {
        // Error is already handled by addDocumentNonBlocking, just stop execution
        setIsLoading(false);
        return;
      }

      const sentimentResult = await analyzeSentiment({ text });
      const sentimentData = {
        score: sentimentResult.sentimentScore,
        emotion: sentimentResult.emotion,
      };

      // Non-blocking update
      updateDocumentNonBlocking(userMessageRef, { sentiment: sentimentData });

      const conversationContext = (messages ?? [])
        .slice(-5)
        .map(m => `${m.role}: ${m.text}`)
        .join('\n');

      const recommendationResult = await getPersonalizedRecommendation({
        emotion: sentimentResult.emotion,
        conversationContext: conversationContext,
      });

      const assistantMessage: Omit<ChatMessage, 'id'> = {
        role: 'assistant',
        text: recommendationResult.recommendation,
        timestamp: serverTimestamp() as any,
      };
      // Non-blocking add
      addDocumentNonBlocking(messagesCollectionRef, assistantMessage);

      // Non-blocking update
      updateDocumentNonBlocking(chatSessionRef, { updatedAt: serverTimestamp() });
    } catch (error) {
      // This will primarily catch errors from the AI flows or if addDoc fails before the catch inside.
      console.error('An unexpected error occurred:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <ChatMessages messages={messages || []} isLoading={isLoading || messagesLoading} />
      <div className="border-t p-4 bg-background">
        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  );
}
