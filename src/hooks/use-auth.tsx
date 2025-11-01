'use client';

import {
  useState,
  useEffect,
  useContext,
  createContext,
  useCallback,
  ReactNode,
} from 'react';
import type { AuthContextType, UserProfile } from '@/lib/types';
import { useRouter } from 'next/navigation';
import {
  useUser,
  useAuth as useFirebaseAuth,
  useFirestore,
  useDoc,
  useMemoFirebase,
  setDocumentNonBlocking
} from '@/firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User as FirebaseUser,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, serverTimestamp } from 'firebase/firestore';

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useFirebaseAuthProvider();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useFirebaseAuthProvider = (): AuthContextType => {
  const { user, isUserLoading } = useUser();
  const auth = useFirebaseAuth();
  const firestore = useFirestore();
  const router = useRouter();

  const userProfileRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userProfile, isLoading: isProfileLoading } =
    useDoc<UserProfile>(userProfileRef);

  const loading = isUserLoading || isProfileLoading;

  const handleUserAuth = useCallback(
    async (firebaseUser: FirebaseUser) => {
      if (!firestore) return;
      const userRef = doc(firestore, 'users', firebaseUser.uid);

      const profile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        settings: {
          enableSentimentAnalysis: true,
          dataRetentionPeriod: '90d',
        },
        chatSessions: {},
        chatMessages: {},
      };
      
      // Use non-blocking write to create the user document only if it doesn't exist.
      // We pass the entire profile object to ensure the document is created.
      setDocumentNonBlocking(userRef, profile, { merge: true });

      router.push('/dashboard');
    },
    [firestore, router]
  );

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await handleUserAuth(result.user);
    } catch (error) {
      console.error('Google sign-in error', error);
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      await handleUserAuth(result.user);
    } catch (error) {
      console.error('Email sign-in error', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  return { userProfile: userProfile ?? null, loading, signInWithGoogle, signInWithEmail, logout };
};
