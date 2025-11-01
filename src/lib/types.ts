import type { User as FirebaseUser } from 'firebase/auth';
import type { Timestamp } from 'firebase/firestore';

export type UserProfile = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  settings?: UserSettings;
};

export type UserSettings = {
  enableSentimentAnalysis: boolean;
  dataRetentionPeriod: '30d' | '90d' | '1y' | 'forever';
};

export type Sentiment = {
  score: number;
  emotion: string;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date | Timestamp;
  userId: string;
  sentiment?: Sentiment;
};

export type ChatSession = {
  id: string;
  userId: string;
  updatedAt: Date | Timestamp;
  title: string;
};

export type MoodScore = {
  date: string;
  score: number;
};

export interface AuthContextType {
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}
