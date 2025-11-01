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
import { Timestamp } from 'firebase/firestore';
import { useChat } from '@/context/ChatProvider';
import { Skeleton } from '../ui/skeleton';

export default function RecentActivity() {
  const { sessions, setActiveSessionId, activeSessionId, isLoading } = useChat();

  const toDate = (timestamp: any): Date => {
      if (timestamp instanceof Timestamp) {
          return timestamp.toDate();
      }
      if (timestamp?.seconds) {
        return new Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate();
      }
      return new Date(timestamp);
  }

  return (
    <Card className="transform-gpu transition-transform duration-300 hover:-translate-y-1 glass-card">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          An overview of your recent conversations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          )}
          {!isLoading && sessions && sessions.length > 0 ? (
            sessions.slice(0, 3).map(session => (
              <button 
                key={session.id} 
                onClick={() => setActiveSessionId(session.id)}
                className={`flex items-center p-3 rounded-lg transition-colors w-full text-left ${activeSessionId === session.id ? 'bg-primary/10' : 'hover:bg-accent/50'}`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground flex-shrink-0">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div className="ml-4 flex-1 overflow-hidden">
                  <p className="text-sm font-medium leading-none truncate">
                    {session.title}
                  </p>
                  {session.updatedAt && (
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(toDate(session.updatedAt), {
                        addSuffix: true,
                      })}
                    </p>
                  )}
                </div>
              </button>
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
