
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
  useCollection,
  useMemoFirebase,
} from '@/firebase';
import { collection, doc, query, orderBy, serverTimestamp, writeBatch, collectionGroup, where } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

interface ChatContextType {
  userProfile: UserProfile | null;
  sessions: ChatSession[];
  messages: ChatMessage[];
  moodScores: MoodScore[];
  isLoading: boolean;
  activeSessionId: string | null;
  setActiveSessionId: (sessionId: string | null) => void;
  startNewSession: (initialMessageText?: string) => Promise<string | undefined>;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>, userId: string, sentiment?: Sentiment) => Promise<string>;
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
  const { userProfile, loading: authLoading } = useAuth();
  const firestore = useFirestore();
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // --- Data Fetching ---
  const sessionsQuery = useMemoFirebase(() => {
    if (!userProfile?.uid || !firestore) return null;
    return query(collection(firestore, 'users', userProfile.uid, 'chatSessions'), orderBy('updatedAt', 'desc'));
  }, [userProfile?.uid, firestore]);
  const { data: sessions = [], isLoading: sessionsLoading } = useCollection<ChatSession>(sessionsQuery);

  const messagesQuery = useMemoFirebase(() => {
    if (!userProfile?.uid || !activeSessionId || !firestore) return null;
    return query(collection(firestore, 'users', userProfile.uid, 'chatSessions', activeSessionId, 'messages'), orderBy('timestamp', 'asc'));
  }, [userProfile?.uid, activeSessionId, firestore]);
  const { data: messagesData, isLoading: messagesLoading } = useCollection<ChatMessage>(messagesQuery);
  const messages = messagesData || [];

  const allMessagesQuery = useMemoFirebase(() => {
    if (!userProfile?.uid || !firestore) return null;
    return query(
      collectionGroup(firestore, 'messages'),
      where('userId', '==', userProfile.uid),
      orderBy('timestamp', 'asc')
    );
  }, [userProfile?.uid, firestore]);
  
  const { data: allMessagesData } = useCollection<ChatMessage>(allMessagesQuery);

  const moodScores = useMemo(() => {
    if (!allMessagesData) return [];
    return allMessagesData
      .filter(m => m.userId === userProfile?.uid && m.sentiment)
      .map(m => ({
        ...m.sentiment,
        timestamp: m.timestamp
      })) as MoodScore[];
  }, [allMessagesData, userProfile?.uid]);


  // --- State ---
  const [moodSummary, setMoodSummary] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [latestSentiment, setLatestSentiment] = useState<Sentiment | null>(null);
  const isLoading = authLoading || sessionsLoading;

  // --- Effects ---
  useEffect(() => {
    if (!isLoading && userProfile) {
      if (sessions === null) return;
      if (!activeSessionId && sessions.length > 0) {
        setActiveSessionId(sessions[0].id);
      } else if (activeSessionId && !sessions.some(s => s.id === activeSessionId)) {
        setActiveSessionId(sessions.length > 0 ? sessions[0].id : null);
      } else if (!activeSessionId && sessions.length === 0) {
        startNewSession('Hello! How are you feeling today?');
      }
    }
  }, [isLoading, userProfile, sessions, activeSessionId]);

  // --- Functions ---
  const startNewSession = useCallback(async (initialMessageText?: string) => {
    if (!userProfile || !firestore) return;

    const newSessionId = uuidv4();
    const sessionRef = doc(firestore, 'users', userProfile.uid, 'chatSessions', newSessionId);
    const newSession: ChatSession = {
      id: newSessionId,
      userId: userProfile.uid,
      title: 'New Conversation',
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
      lastMessage: initialMessageText || '',
    };
    
    setActiveSessionId(newSessionId);
    setMoodSummary(null);
    setLatestSentiment(null);
    setSuggestions([]);

    const batch = writeBatch(firestore);
    batch.set(sessionRef, newSession);

    if (initialMessageText) {
      const messageId = uuidv4();
      const messageRef = doc(firestore, 'users', userProfile.uid, 'chatSessions', newSessionId, 'messages', messageId);
      const initialMessage: ChatMessage = {
          id: messageId,
          role: 'assistant',
          text: initialMessageText,
          timestamp: serverTimestamp() as any,
          userId: 'assistant',
      };
      batch.set(messageRef, initialMessage);
    }
    
    await batch.commit();
    return newSessionId;
  }, [userProfile, firestore]);

  const addMessage = useCallback(async (message: Omit<ChatMessage, 'id' | 'timestamp'>, userId: string, sentiment?: Sentiment): Promise<string> => {
    if (!activeSessionId || !userProfile || !firestore) throw new Error("Cannot add message, context not ready");
    
    const messageId = uuidv4();
    const messageRef = doc(firestore, 'users', userProfile.uid, 'chatSessions', activeSessionId, 'messages', messageId);

    const newMessage: ChatMessage = {
      id: messageId,
      ...message,
      userId,
      timestamp: serverTimestamp() as any,
      ...(sentiment && { sentiment }),
    };
    
    const sessionRef = doc(firestore, 'users', userProfile.uid, 'chatSessions', activeSessionId);
    const sessionUpdate: Partial<ChatSession> = {
        updatedAt: serverTimestamp() as any,
        lastMessage: message.text,
    };

    const currentSession = sessions?.find(s => s.id === activeSessionId);
    if (currentSession?.title === 'New Conversation' && message.role === 'user' && message.text) {
      sessionUpdate.title = message.text.substring(0, 30) + (message.text.length > 30 ? '...' : '');
    }
    
    const batch = writeBatch(firestore);
    batch.set(messageRef, newMessage);
    batch.update(sessionRef, sessionUpdate);

    await batch.commit();
    
    return messageId;
  }, [activeSessionId, userProfile, firestore, sessions]);

  const value = {
    userProfile,
    sessions,
    messages,
    moodScores,
    isLoading: isLoading || messagesLoading,
    activeSessionId,
    setActiveSessionId,
    startNewSession,
    addMessage,
    moodSummary,
    setMoodSummary,
    suggestions,
    setSuggestions,
    latestSentiment,
    setLatestSentiment,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
