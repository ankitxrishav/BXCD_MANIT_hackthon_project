'use client';

import { useAuth } from '@/hooks/use-auth.tsx';
import RecentActivity from '@/components/dashboard/RecentActivity';
import QuickAccess from '@/components/dashboard/QuickAccess';
import { Skeleton } from '@/components/ui/skeleton';
import AiSuggestions from '@/components/dashboard/AiSuggestions';
import MoodHistory from '@/components/dashboard/MoodHistory';
import AnimatedWrapper, { AnimatedItem } from '@/components/landing/AnimatedWrapper';
import ChatBubble from '@/components/chat/ChatBubble';

export default function DashboardPage() {
  const { userProfile, loading } = useAuth();
  const firstName = userProfile?.displayName?.split(' ')[0] || userProfile?.email || 'there';

  if (loading || !userProfile) {
    return (
        <div className="space-y-8">
            <Skeleton className="h-10 w-1/3" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Skeleton className="h-80 w-full lg:col-span-2" />
                <Skeleton className="h-80 w-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
        </div>
    );
  }

  return (
    <AnimatedWrapper type="stagger-children" className="space-y-8">
      <AnimatedItem>
        <h1 className="text-3xl font-bold font-headline">Welcome back, {firstName}!</h1>
        <p className="text-muted-foreground">Here's a look at your recent activity and mood.</p>
      </AnimatedItem>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <AnimatedItem className="lg:col-span-2">
            <MoodHistory />
        </AnimatedItem>
        <AnimatedItem>
            <AiSuggestions />
        </AnimatedItem>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <AnimatedItem>
            <QuickAccess />
        </AnimatedItem>
        <AnimatedItem>
            <RecentActivity />
        </AnimatedItem>
      </div>
       <ChatBubble initialMessage="Welcome back! Ready to explore your dashboard insights?" />
    </AnimatedWrapper>
  );
}
