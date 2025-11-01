'use client';

import { useState, useEffect, useContext, createContext, useCallback } from 'react';
import type { AuthContextType, UserProfile, MockUser } from '@/lib/types';
import { useRouter } from 'next/navigation';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// A mock user for demonstration purposes
const MOCK_USER: MockUser = {
  uid: 'mock-user-123',
  email: 'user@example.com',
  displayName: 'Alex Doe',
  photoURL: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
};

const MOCK_USER_PROFILE: UserProfile = {
    uid: 'mock-user-123',
    email: 'user@example.com',
    displayName: 'Alex Doe',
    photoURL: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    settings: {
        enableSentimentAnalysis: true,
        dataRetentionPeriod: '90d'
    }
};

const handleSignIn = (router: any, setUser: any, setUserProfile: any, setLoading: any) => {
    setLoading(true);
    // Simulate a successful login
    return new Promise(resolve => setTimeout(resolve, 500)).then(() => {
        const sessionUser = JSON.stringify(MOCK_USER);
        sessionStorage.setItem('mockUser', sessionUser);
        setUser(MOCK_USER);
        setUserProfile(MOCK_USER_PROFILE);
        router.push('/dashboard');
        setLoading(false);
    });
};

export const useAuthProvider = (): AuthContextType => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  useEffect(() => {
    // Simulate checking auth state
    setLoading(true);
    const sessionUser = sessionStorage.getItem('mockUser');
    if (sessionUser) {
      const parsedUser = JSON.parse(sessionUser);
      setUser(parsedUser);
      setUserProfile(MOCK_USER_PROFILE);
    }
    setLoading(false);
  }, []);

  const signInWithGoogle = async () => {
    await handleSignIn(router, setUser, setUserProfile, setLoading);
  };

  const signInWithEmail = async (email: string, pass: string) => {
    // Here you can add mock validation if needed
    console.log(`Signing in with Email: ${email}, Pass: ${pass}`);
    await handleSignIn(router, setUser, setUserProfile, setLoading);
  }

  const logout = async () => {
    setLoading(true);
    // Simulate a logout
    await new Promise(resolve => setTimeout(resolve, 500));
    sessionStorage.removeItem('mockUser');
    setUser(null);
    setUserProfile(null);
    router.push('/login');
    // A small delay to allow router to push before setting loading to false
    setTimeout(() => setLoading(false), 100);
  };

  return { user, userProfile, loading, signInWithGoogle, signInWithEmail, logout };
};
