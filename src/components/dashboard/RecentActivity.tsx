
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useChat } from '@/context/ChatProvider';
import { useCollection, useMemoFirebase } from '@/firebase';
import { useAuth } from '@/hooks/use-auth.tsx';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { ChatSession } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

export default function RecentActivity() {
  const { userProfile } = useAuth();
  const firestore = useFirestore();

  const sessionsQuery = useMemoFirebase(() => {
    if (!userProfile || !firestore) return null;
    return query(
      collection(firestore, `users/${userProfile.uid}/chatSessions`),
      orderBy('updatedAt', 'desc'),
      limit(3)
    );
  }, [firestore, userProfile]);

  const { data: recentSessions, isLoading } = useCollection<ChatSession>(sessionsQuery);

  return (
    <Card className="transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          An overview of your recent conversations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          )}
          {!isLoading && recentSessions && recentSessions.length > 0 ? (
            recentSessions.map(session => (
              <div key={session.id} className="flex items-center p-2 rounded-lg transition-colors hover:bg-accent/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium leading-none truncate">
                    {session.title}
                  </p>
                  {session.updatedAt && (
                    <p className="text-sm text-muted-foreground">
                      Last activity{' '}
                      {formatDistanceToNow(new Date(session.updatedAt as any), {
                        addSuffix: true,
                      })}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : !isLoading && (
            <div className="text-center text-muted-foreground py-8">
              <p>No recent activity yet.</p>
              <p className="text-sm">
                Start a chat to see your history here.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
