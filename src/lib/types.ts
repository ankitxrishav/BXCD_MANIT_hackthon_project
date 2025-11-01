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
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
  title: string;
  lastMessage?: string;
};

export type MoodScore = {
  date: string;
  score: number;
  emotion: string;
  timestamp: Date | Timestamp;
};

export type Recommendation = {
    id: string;
    userId: string;
    text: string;
    type: 'meditation' | 'journal' | 'breathing' | 'activity' | 'affirmation';
    timestamp: Date | Timestamp;
}

export interface AuthContextType {
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

export type Badge = {
    id: string;
    name: string;
    description: string;
    icon: string;
    achieved: boolean;
};
