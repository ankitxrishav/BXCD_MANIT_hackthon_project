
import type { User as FirebaseUser } from 'firebase/auth';
import type { Timestamp } from 'firebase/firestore';

export type UserProfile = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Timestamp;
  settings?: UserSettings;
};

export type UserSettings = {
  enableSentimentAnalysis: boolean;
  dataRetentionPeriod: '30d' | '90d' | '1y' | 'forever';
};

export type ChatMessage = {
  id?: string;
  userId?: string; // Add userId to associate message with user for collection group queries
  role: 'user' | 'assistant';
  text: string;
  timestamp: Timestamp;
  sentiment?: {
    score: number;
    emotion: string;
  };
};

export type ChatSession = {
  id?: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  title: string;
};

export type MoodScore = {
  date: string;
  score: number;
};

export type AuthContextType = {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};
