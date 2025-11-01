
'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import type { ChatMessage, ChatSession } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';

interface ChatContextType {
  messages: ChatMessage[];
  sessions: ChatSession[];
  activeSessionId: string | null;
  addMessage: (message: ChatMessage) => void;
  startNewSession: (initialMessageText?: string) => void;
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
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const startNewSession = useCallback((initialMessageText?: string) => {
    if (!user) return;

    const newSessionId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newSessionId,
      userId: user.uid,
      title: `New Conversation`,
      updatedAt: new Date(),
    };
    
    setSessions(prev => [...prev, newSession]);
    setActiveSessionId(newSessionId);

    let initialMessages: ChatMessage[] = [];
    if (initialMessageText) {
      initialMessages.push({
        id: `initial-${Date.now()}`,
        role: 'assistant',
        text: initialMessageText,
        timestamp: new Date(),
      });
    }
    setMessages(initialMessages);
  }, [user]);
  
  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => [...prev, message]);

    // Update session title and timestamp
    setSessions(prevSessions =>
      prevSessions.map(session => {
        if (session.id === activeSessionId) {
          // If the title is generic, update it with the first user message
          const isGenericTitle = session.title === 'New Conversation';
          const newTitle = (isGenericTitle && message.role === 'user') ? message.text : session.title;
          return { ...session, title: newTitle, updatedAt: new Date() };
        }
        return session;
      })
    );
  }, [activeSessionId]);


  const value = {
    messages,
    sessions,
    activeSessionId,
    addMessage,
    startNewSession,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
