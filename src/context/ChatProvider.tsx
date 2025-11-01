'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from 'react';
import type { ChatMessage, ChatSession, Sentiment, UserProfile, MoodScore } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth.tsx';
import {
  useFirestore,
  useCollection,
  useMemoFirebase,
  setDocumentNonBlocking,
  updateDocumentNonBlocking,
} from '@/firebase';
import { collection, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

interface ChatContextType {
  userProfile: UserProfile | null;
  sessions: ChatSession[];
  messages: ChatMessage[];
  moodScores: MoodScore[];
  isLoading: boolean;
  activeSessionId: string | null;
  setActiveSessionId: (sessionId: string | null) => void;
  startNewSession: (initialMessageText?: string) => Promise<void>;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp' | 'userId'>, userId: string) => Promise<string>;
  updateMessage: (sessionId: string, messageId: string, updates: Partial<ChatMessage>) => void;
  addMoodEntry: (sentiment: Sentiment) => void;
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
  const { data: messages = [], isLoading: messagesLoading } = useCollection<ChatMessage>(messagesQuery);
  
  const moodTimelineQuery = useMemoFirebase(() => {
    if (!userProfile?.uid || !firestore) return null;
    return query(collection(firestore, 'users', userProfile.uid, 'moodTimeline'), orderBy('timestamp', 'desc'));
  }, [userProfile?.uid, firestore]);
  const { data: moodScores = [], isLoading: moodScoresLoading } = useCollection<MoodScore>(moodTimelineQuery);

  // --- State ---
  const [moodSummary, setMoodSummary] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [latestSentiment, setLatestSentiment] = useState<Sentiment | null>(null);
  const isLoading = authLoading || sessionsLoading || messagesLoading || moodScoresLoading;

  // --- Effects ---
  useEffect(() => {
    if (!isLoading && userProfile) {
      if (!activeSessionId && sessions && sessions.length > 0) {
        setActiveSessionId(sessions[0].id);
      } else if (sessions && sessions.length === 0) {
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
    
    setDocumentNonBlocking(sessionRef, newSession, {});

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
      setDocumentNonBlocking(messageRef, initialMessage, {});
    }
    
    setActiveSessionId(newSessionId);
    setMoodSummary(null);
    setLatestSentiment(null);
    setSuggestions([]);
  }, [userProfile, firestore]);

  const addMessage = useCallback(async (message: Omit<ChatMessage, 'id' | 'timestamp'>, userId: string): Promise<string> => {
    if (!activeSessionId || !userProfile || !firestore) throw new Error("Cannot add message, context not ready");
    
    const messageId = uuidv4();
    const newMessage: ChatMessage = {
      ...message,
      id: messageId,
      userId,
      timestamp: serverTimestamp() as any,
    };
    
    const messageRef = doc(firestore, 'users', userProfile.uid, 'chatSessions', activeSessionId, 'messages', messageId);
    setDocumentNonBlocking(messageRef, newMessage, {});

    // Update session metadata
    const sessionRef = doc(firestore, 'users', userProfile.uid, 'chatSessions', activeSessionId);
    const sessionUpdate: Partial<ChatSession> = {
        updatedAt: serverTimestamp() as any,
        lastMessage: message.text,
    };

    const currentSession = sessions?.find(s => s.id === activeSessionId);
    if (currentSession?.title === 'New Conversation' && message.role === 'user' && message.text) {
      sessionUpdate.title = message.text.substring(0, 30) + (message.text.length > 30 ? '...' : '');
    }
    
    updateDocumentNonBlocking(sessionRef, sessionUpdate);
    
    return messageId;
  }, [activeSessionId, userProfile, firestore, sessions]);

  const updateMessage = useCallback((sessionId: string, messageId: string, updates: Partial<ChatMessage>) => {
    if (!userProfile || !firestore) return;
    const messageRef = doc(firestore, 'users', userProfile.uid, 'chatSessions', sessionId, 'messages', messageId);
    updateDocumentNonBlocking(messageRef, updates);
  }, [userProfile, firestore]);

  const addMoodEntry = useCallback((sentiment: Sentiment) => {
    if (!userProfile || !firestore) return;
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const moodRef = doc(firestore, 'users', userProfile.uid, 'moodTimeline', today);
    const newMoodEntry: MoodScore = {
        date: today,
        score: sentiment.score,
        emotion: sentiment.emotion,
        timestamp: serverTimestamp() as any,
    };
    // This will create or overwrite the mood for the day. For more granular tracking, use addDoc.
    setDocumentNonBlocking(moodRef, newMoodEntry, { merge: true });
  }, [userProfile, firestore]);

  const value = {
    userProfile,
    sessions,
    messages,
    moodScores,
    isLoading,
    activeSessionId,
    setActiveSessionId,
    startNewSession,
    addMessage,
    updateMessage,
    addMoodEntry,
    moodSummary,
    setMoodSummary,
    suggestions,
    setSuggestions,
    latestSentiment,
    setLatestSentiment,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
