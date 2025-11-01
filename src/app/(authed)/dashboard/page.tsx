
'use client';

import { useAuth } from '@/hooks/use-auth.tsx';
import RecentActivity from '@/components/dashboard/RecentActivity';
import QuickAccess from '@/components/dashboard/QuickAccess';
import { Skeleton } from '@/components/ui/skeleton';
import MoodAnalysis from '@/components/dashboard/MoodAnalysis';
import AiSuggestions from '@/components/dashboard/AiSuggestions';

export default function DashboardPage() {
  const { userProfile, loading } = useAuth();
  const firstName = userProfile?.displayName?.split(' ')[0] || userProfile?.email || 'there';

  if (loading || !userProfile) {
    return (
        <div className="space-y-8">
            <Skeleton className="h-10 w-1/3" />
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Skeleton className="h-80 w-full" />
                </div>
                <div className="space-y-8">
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
            <Skeleton className="h-48 w-full" />
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Welcome, {firstName}!</h1>
        <p className="text-muted-foreground">Here's a look at your recent activity and mood.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
            <MoodAnalysis />
            <AiSuggestions />
        </div>

        <div className="space-y-8">
            <QuickAccess />
            <RecentActivity />
        </div>
      </div>
    </div>
  );
}
