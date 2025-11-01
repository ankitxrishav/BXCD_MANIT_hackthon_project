
'use client';

import { useState, useEffect, useContext, createContext, useCallback } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, Firestore } from 'firebase/firestore';
import { useFirebase } from '@/firebase/provider';
import type { AuthContextType, UserProfile } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { Auth, User } from 'firebase/auth';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = (): AuthContextType => {
  const { user, isUserLoading, auth, firestore } = useFirebase();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUserProfile = useCallback(async (firebaseUser: User, db: Firestore) => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      setUserProfile(userSnap.data() as UserProfile);
    } else {
      const newUserProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        createdAt: serverTimestamp() as any,
        settings: {
          enableSentimentAnalysis: true,
          dataRetentionPeriod: '90d',
        }
      };
      await setDoc(userRef, newUserProfile);
      setUserProfile(newUserProfile);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (!isUserLoading) {
      if (user && firestore) {
        fetchUserProfile(user, firestore).then(() => {
          if(isMounted) setLoading(false);
        });
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    }
    return () => { isMounted = false; };
  }, [user, isUserLoading, firestore, fetchUserProfile]);

  const signInWithGoogle = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  };

  const logout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  return { user, userProfile, loading, signInWithGoogle, logout };
};
