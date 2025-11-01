
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore'

type FirebaseServices = {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

// This function is the single source of truth for Firebase initialization.
export function initializeFirebase(): FirebaseServices {
  if (getApps().length) {
    const app = getApp();
    return getSdks(app);
  }

  // Passing the config directly to initializeApp is the most robust way
  // to ensure Firebase is initialized correctly, especially in environments
  // where environment variables might not be perfectly configured.
  const firebaseApp = initializeApp(firebaseConfig);
  return getSdks(firebaseApp);
}

// Helper to get all the SDKs from a FirebaseApp instance.
export function getSdks(firebaseApp: FirebaseApp): FirebaseServices {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './errors';
export * from './error-emitter';
