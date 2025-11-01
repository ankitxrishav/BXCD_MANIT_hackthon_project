
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { ChatMessage, ChatSession } from '@/lib/types';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { getPersonalizedRecommendation } from '@/ai/flows/personalized-recommendations';
import { analyzeSentiment } from '@/ai/flows/sentiment-analysis';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase/firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { useCollection } from '@/lib/firebase/hooks/useCollection';
import { useDocument } from '@/lib/firebase/hooks/useDocument';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const CHAT_SESSION_ID = 'current_chat'; // For simplicity, using a single chat session

export default function ChatClient() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const chatSessionRef = useMemo(() => {
    if (!user) return null;
    return doc(db, 'users', user.uid, 'chatSessions', CHAT_SESSION_ID);
  }, [user]);

  const { data: chatSession } = useDocument<ChatSession>(chatSessionRef);

  const messagesRef = useMemo(() => {
    if (!chatSessionRef) return null;
    return query(
      collection(chatSessionRef, 'chatMessages'),
      orderBy('timestamp', 'asc'),
      limit(50)
    );
  }, [chatSessionRef]);

  const { data: messages, loading: messagesLoading } = useCollection<ChatMessage>(messagesRef);

  const createSessionIfNeeded = useCallback(() => {
    if (user && !chatSession && chatSessionRef) {
      const newSession = {
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        title: 'Current Session',
      };
      setDoc(chatSessionRef, newSession).catch(error => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: chatSessionRef.path,
          operation: 'create',
          requestResourceData: newSession,
        }));
      });

      // Add initial assistant message
      const initialMsgRef = collection(chatSessionRef, 'chatMessages');
      const initialMessage = {
          role: 'assistant' as const,
          text: 'Hello! How are you feeling today?',
          timestamp: serverTimestamp(),
      };
      addDoc(initialMsgRef, initialMessage).catch(error => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: initialMsgRef.path,
            operation: 'create',
            requestResourceData: initialMessage,
        }));
      });
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
    
    // 1. Add user message to Firestore
    addDoc(messagesCollectionRef, userMessage)
      .then(async (userMessageRef) => {
        // 2. Analyze sentiment
        const sentimentResult = await analyzeSentiment({ text });
        const sentimentData = {
          score: sentimentResult.sentimentScore,
          emotion: sentimentResult.emotion,
        };

        // 3. Update user message with sentiment
        setDoc(userMessageRef, { sentiment: sentimentData }, { merge: true })
          .catch(error => {
              errorEmitter.emit('permission-error', new FirestorePermissionError({
                  path: userMessageRef.path,
                  operation: 'update',
                  requestResourceData: { sentiment: sentimentData },
              }));
          });
        
        // 4. Get personalized recommendation
        const conversationContext = (messages ?? [])
          .slice(-5)
          .map(m => `${m.role}: ${m.text}`)
          .join('\n');

        const recommendationResult = await getPersonalizedRecommendation({
          emotion: sentimentResult.emotion,
          conversationContext: conversationContext,
        });

        // 5. Add assistant message to Firestore
        const assistantMessage: Omit<ChatMessage, 'id'> = {
          role: 'assistant',
          text: recommendationResult.recommendation,
          timestamp: serverTimestamp() as any,
        };
        addDoc(messagesCollectionRef, assistantMessage).catch(error => {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: messagesCollectionRef.path,
                operation: 'create',
                requestResourceData: assistantMessage,
            }));
        });

        // 6. Update session updated_at
        setDoc(chatSessionRef, { updatedAt: serverTimestamp() }, { merge: true }).catch(error => {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: chatSessionRef.path,
                operation: 'update',
                requestResourceData: { updatedAt: 'serverTimestamp' },
            }));
        });

      })
      .catch(error => { // Catch error from adding user message
        errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: messagesCollectionRef.path,
            operation: 'create',
            requestResourceData: userMessage,
        }));
      })
      .finally(() => {
        setIsLoading(false);
      });
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
