
'use client';

import React from 'react';
import { AuthContext, useAuthProvider } from '@/hooks/use-auth';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuthProvider();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
