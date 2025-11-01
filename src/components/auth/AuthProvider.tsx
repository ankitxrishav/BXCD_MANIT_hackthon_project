'use client';

import React from 'react';
import { AuthContext, useFirebaseAuthProvider } from '@/hooks/use-auth';
import { FirebaseClientProvider } from '@/firebase';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useFirebaseAuthProvider();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
