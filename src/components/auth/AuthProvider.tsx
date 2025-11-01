
'use client';

import React from 'react';
import { AuthContext, useAuthProvider } from '@/hooks/use-auth';
import type { AuthContextType } from '@/lib/types';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuthProvider();
  return <AuthContext.Provider value={auth as AuthContextType}>{children}</AuthContext.Provider>;
};
