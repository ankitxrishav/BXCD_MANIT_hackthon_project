'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AppShell from '@/components/layout/AppShell';
import { Skeleton } from '@/components/ui/skeleton';

export default function AuthedLayout({ children }: { children: React.ReactNode }) {
  const { userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !userProfile) {
      router.push('/login');
    }
  }, [userProfile, loading, router]);

  if (loading || !userProfile) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="w-full h-full p-4 space-y-4">
          <Skeleton className="h-16 w-full" />
          <div className="grid grid-cols-3 gap-4 h-[calc(100vh-8rem)]">
              <Skeleton className="col-span-1 h-full" />
              <Skeleton className="col-span-2 h-full" />
          </div>
        </div>
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
