'use client';

import { useAuth } from '@/hooks/use-auth';
import RecentActivity from '@/components/dashboard/RecentActivity';
import QuickAccess from '@/components/dashboard/QuickAccess';
import { Skeleton } from '@/components/ui/skeleton';
import AiSuggestions from '@/components/dashboard/AiSuggestions';
import MoodHistory from '@/components/dashboard/MoodHistory';
import { motion } from 'framer-motion';
import ChatDialog from '@/components/chat/ChatDialog';
import { useState, useEffect } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};


export default function DashboardPage() {
  const { userProfile, loading } = useAuth();
  const [isChatOpen, setChatOpen] = useState(false);
  const firstName = userProfile?.displayName?.split(' ')[0] || userProfile?.email || 'there';

  useEffect(() => {
    // Open the chat dialog automatically on page load
    const timer = setTimeout(() => setChatOpen(true), 500);
    return () => clearTimeout(timer);
  }, []);

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
    <>
      <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold font-headline">Welcome back, {firstName}!</h1>
          <p className="text-muted-foreground">Here's a look at your recent activity and mood.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
              <MoodHistory />
          </div>
          <div>
              <AiSuggestions />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
              <QuickAccess />
          </div>
          <div>
              <RecentActivity />
          </div>
        </div>
      </motion.div>
      <ChatDialog isOpen={isChatOpen} onOpenChange={setChatOpen} />
    </>
  );
}
