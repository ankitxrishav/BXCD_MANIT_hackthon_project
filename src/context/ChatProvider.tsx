
'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  Dispatch,
  SetStateAction,
  useEffect,
} from 'react';
import type { ChatMessage, ChatSession, Sentiment } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth.tsx';
import {
  collection,
  doc,
  serverTimestamp,
  addDoc,
  setDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';

interface ChatContextType {
  messages: ChatMessage[];
  sessions: ChatSession[];
  activeSessionId: string | null;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  startNewSession: (initialMessageText?: string) => void;
  setActiveSessionId: (sessionId: string | null) => void;
  moodSummary: string | null;
  setMoodSummary: Dispatch<SetStateAction<string | null>>;
  suggestions: string[];
  setSuggestions: Dispatch<SetStateAction<string[]>>;
  latestSentiment: Sentiment | null;
  setLatestSentiment: Dispatch<SetStateAction<Sentiment | null>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { userProfile } = useAuth();
  const firestore = useFirestore();
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const messagesQuery = useMemoFirebase(() => {
    if (!activeSessionId || !userProfile || !firestore) return null;
    return query(
      collection(
        firestore,
        `users/${userProfile.uid}/chatSessions/${activeSessionId}/chatMessages`
      ),
      orderBy('timestamp', 'asc')
    );
  }, [activeSessionId, userProfile, firestore]);

  const { data: messages } = useCollection<ChatMessage>(messagesQuery);

  const sessionsQuery = useMemoFirebase(() => {
    if (!userProfile || !firestore) return null;
    return query(
      collection(firestore, `users/${userProfile.uid}/chatSessions`),
      orderBy('updatedAt', 'desc')
    );
  }, [userProfile, firestore]);

  const { data: sessions } = useCollection<ChatSession>(sessionsQuery);

  const [moodSummary, setMoodSummary] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [latestSentiment, setLatestSentiment] = useState<Sentiment | null>(
    null
  );

  useEffect(() => {
    if (!activeSessionId && sessions && sessions.length > 0) {
      setActiveSessionId(sessions[0].id);
    }
  }, [sessions, activeSessionId]);


  const startNewSession = useCallback(
    async (initialMessageText?: string) => {
      if (!userProfile || !firestore) return;

      const newSessionRef = doc(
        collection(firestore, `users/${userProfile.uid}/chatSessions`)
      );

      const newSession: Omit<ChatSession, 'id'> = {
        userId: userProfile.uid,
        title: `New Conversation`,
        updatedAt: serverTimestamp() as any,
      };

      await setDoc(newSessionRef, newSession);
      const newSessionId = newSessionRef.id;

      setActiveSessionId(newSessionId);
      setMoodSummary(null);
      setLatestSentiment(null);

      if (initialMessageText) {
        const messagesCol = collection(
          firestore,
          `users/${userProfile.uid}/chatSessions/${newSessionId}/chatMessages`
        );
        addDoc(messagesCol, {
          role: 'assistant',
          text: initialMessageText,
          timestamp: serverTimestamp(),
          userId: 'assistant',
        });
      }
    },
    [userProfile, firestore]
  );

  const addMessage = useCallback(
    async (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
      if (!activeSessionId || !userProfile || !firestore) return;

      const messagesCol = collection(
        firestore,
        `users/${userProfile.uid}/chatSessions/${activeSessionId}/chatMessages`
      );
      await addDoc(messagesCol, {
        ...message,
        timestamp: serverTimestamp(),
      });

      const sessionRef = doc(
        firestore,
        `users/${userProfile.uid}/chatSessions`,
        activeSessionId
      );
      
      const currentSession = sessions && sessions.find(s => s.id === activeSessionId);
      const isGenericTitle = currentSession?.title === 'New Conversation';
      
      const updatePayload: any = {
        updatedAt: serverTimestamp(),
      };

      if (isGenericTitle && message.role === 'user' && message.text) {
        updatePayload.title = message.text.substring(0, 30) + (message.text.length > 30 ? '...' : '');
      }
      
      await setDoc(
        sessionRef,
        updatePayload,
        { merge: true }
      );
    },
    [activeSessionId, userProfile, firestore, sessions]
  );

  const value = {
    messages: messages || [],
    sessions: sessions || [],
    activeSessionId,
    addMessage,
    startNewSession,
    setActiveSessionId,
    moodSummary,
    setMoodSummary,
    suggestions,
    setSuggestions,
    latestSentiment,
    setLatestSentiment,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
