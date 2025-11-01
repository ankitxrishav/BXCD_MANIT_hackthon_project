'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import type { ChatMessage, ChatSession, Sentiment, UserProfile, MoodScore } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth.tsx';
import {
  useFirestore,
  useDoc,
  useMemoFirebase,
  setDocumentNonBlocking
} from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

interface ChatContextType {
  userProfile: UserProfile | null;
  sessions: ChatSession[];
  messages: ChatMessage[];
  moodScores: MoodScore[];
  activeSessionId: string | null;
  setActiveSessionId: (sessionId: string | null) => void;
  startNewSession: (initialMessageText?: string) => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp' | 'userId'>, userId: string) => Promise<string>;
  updateMessage: (sessionId: string, messageId: string, updates: Partial<ChatMessage>) => void;
  moodSummary: string | null;
  setMoodSummary: React.Dispatch<React.SetStateAction<string | null>>;
  suggestions: string[];
  setSuggestions: React.Dispatch<React.SetStateAction<string[]>>;
  latestSentiment: Sentiment | null;
  setLatestSentiment: React.Dispatch<React.SetStateAction<Sentiment | null>>;
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
  const { userProfile: authProfile, loading: authLoading } = useAuth();
  const firestore = useFirestore();
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  
  const userDocRef = useMemoFirebase(() => {
    if (!authProfile || !firestore) return null;
    return doc(firestore, 'users', authProfile.uid);
  }, [authProfile, firestore]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userDocRef);

  const sessions = useMemo(() => {
    if (!userProfile?.chatSessions) return [];
    return Object.values(userProfile.chatSessions).sort(
      (a, b) => new Date(b.updatedAt as any).getTime() - new Date(a.updatedAt as any).getTime()
    );
  }, [userProfile]);

  const messages = useMemo(() => {
    if (!userProfile?.chatMessages || !activeSessionId) return [];
    const sessionMessages = userProfile.chatMessages[activeSessionId];
    if (!sessionMessages) return [];
    return Object.values(sessionMessages).sort(
      (a, b) => new Date(a.timestamp as any).getTime() - new Date(b.timestamp as any).getTime()
    );
  }, [userProfile, activeSessionId]);
  
  const moodScores = useMemo(() => {
      if (!userProfile?.chatMessages) return [];
      const allMessages = Object.values(userProfile.chatMessages).flatMap(session => Object.values(session));
      return allMessages
        .filter(msg => msg.sentiment)
        .map(msg => ({
            score: msg.sentiment!.score,
            date: (msg.timestamp as any).toDate ? (msg.timestamp as any).toDate().toISOString() : new Date(msg.timestamp as any).toISOString()
        }));
  }, [userProfile]);

  const [moodSummary, setMoodSummary] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [latestSentiment, setLatestSentiment] = useState<Sentiment | null>(null);

  useEffect(() => {
    if (!authLoading && authProfile && !isProfileLoading) {
      if (!activeSessionId && sessions.length > 0) {
        setActiveSessionId(sessions[0].id);
      } else if (sessions.length === 0) {
        startNewSession('Hello! How are you feeling today?');
      }
    }
  }, [authLoading, authProfile, isProfileLoading, sessions, activeSessionId]);


  const startNewSession = useCallback(async (initialMessageText?: string) => {
      if (!userProfile || !firestore) return;

      const newSessionId = uuidv4();
      const newSession: ChatSession = {
        id: newSessionId,
        userId: userProfile.uid,
        title: `New Conversation`,
        updatedAt: serverTimestamp() as any,
      };

      const updates: any = {
        [`chatSessions.${newSessionId}`]: newSession
      };

      if (initialMessageText) {
        const messageId = uuidv4();
        updates[`chatMessages.${newSessionId}.${messageId}`] = {
            id: messageId,
            role: 'assistant',
            text: initialMessageText,
            timestamp: serverTimestamp(),
            userId: 'assistant',
        };
      }
      
      setDocumentNonBlocking(doc(firestore, `users/${userProfile.uid}`), updates, { merge: true });

      setActiveSessionId(newSessionId);
      setMoodSummary(null);
      setLatestSentiment(null);
      setSuggestions([]);
    }, [userProfile, firestore]
  );
  
  const addMessage = useCallback(async (message: Omit<ChatMessage, 'id' | 'timestamp' | 'userId'>, userId: string): Promise<string> => {
      if (!activeSessionId || !userProfile || !firestore) throw new Error("Cannot add message, context not ready");
      
      const messageId = uuidv4();
      const newMessage = {
        ...message,
        id: messageId,
        userId,
        timestamp: serverTimestamp(),
      };
      
      const currentSession = sessions.find(s => s.id === activeSessionId);
      const isGenericTitle = currentSession?.title === 'New Conversation';

      const updates: any = {
        [`chatMessages.${activeSessionId}.${messageId}`]: newMessage,
        [`chatSessions.${activeSessionId}.updatedAt`]: serverTimestamp()
      };
      
      if (isGenericTitle && message.role === 'user' && message.text) {
        updates[`chatSessions.${activeSessionId}.title`] = message.text.substring(0, 30) + (message.text.length > 30 ? '...' : '');
      }

      setDocumentNonBlocking(doc(firestore, `users/${userProfile.uid}`), updates, { merge: true });
      
      return messageId;

    }, [activeSessionId, userProfile, firestore, sessions]
  );
  
  const updateMessage = useCallback((sessionId: string, messageId: string, updates: Partial<ChatMessage>) => {
      if (!userProfile || !firestore) return;
      
      const updatePayload: any = {};
      for (const [key, value] of Object.entries(updates)) {
          updatePayload[`chatMessages.${sessionId}.${messageId}.${key}`] = value;
      }
      
      setDocumentNonBlocking(doc(firestore, `users/${userProfile.uid}`), updatePayload, { merge: true });

  }, [userProfile, firestore]);

  const value = {
    userProfile,
    sessions,
    messages,
    moodScores,
    activeSessionId,
    setActiveSessionId,
    startNewSession,
    addMessage,
    updateMessage,
    moodSummary,
    setMoodSummary,
    suggestions,
    setSuggestions,
    latestSentiment,
    setLatestSentiment,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
