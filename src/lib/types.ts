
import type { User as FirebaseUser } from 'firebase/auth';
import type { Timestamp } from 'firebase/firestore';

// Note: This is a mocked user. In a real app, this would come from a database.
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

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  sentiment?: {
    score: number;
    emotion: string;
  };
};

export type ChatSession = {
  id: string;
  userId: string;
  updatedAt: Date;
  title: string;
};

export type MoodScore = {
  date: string;
  score: number;
};

// This is a mocked Firebase User object.
export type MockUser = {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
}


export type AuthContextType = {
  user: MockUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};
