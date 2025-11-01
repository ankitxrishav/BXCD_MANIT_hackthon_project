
'use client';

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageSquare, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useCollection } from "@/lib/firebase/hooks/useCollection";
import { collection, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from "../ui/skeleton";
import type { ChatSession } from "@/lib/types";
import { useDocument } from "@/lib/firebase/hooks/useDocument";

const CHAT_SESSION_ID = 'current_chat';

export default function RecentActivity() {
  const { user } = useAuth();

  const chatSessionRef = useMemo(() => {
    if (!user) return null;
    return collection(db, 'users', user.uid, 'chatSessions');
  }, [user]);

  const recentSessionsQuery = useMemo(() => {
      if (!chatSessionRef) return null;
      return query(chatSessionRef, orderBy("updatedAt", "desc"), limit(5));
  }, [chatSessionRef])

  const { data: recentSessions, loading } = useCollection<ChatSession>(recentSessionsQuery);

  if (loading) {
      return (
          <Card>
              <CardHeader>
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
              </CardHeader>
              <CardContent className="space-y-6">
                  {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-start">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div className="ml-4 flex-1 space-y-2">
                              <Skeleton className="h-4 w-3/4" />
                              <Skeleton className="h-4 w-1/4" />
                          </div>
                      </div>
                  ))}
              </CardContent>
          </Card>
      )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>An overview of your recent conversations.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {recentSessions && recentSessions.length > 0 ? (
            recentSessions.map((session) => (
              <div key={session.id} className="flex items-start">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent-foreground">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium leading-none">{session.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Last activity {formatDistanceToNow(session.updatedAt.toDate(), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          ) : (
             <div className="text-center text-muted-foreground py-8">
                <p>No recent activity yet.</p>
                <p className="text-sm">Start a chat to see your history here.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
