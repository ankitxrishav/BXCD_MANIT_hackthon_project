
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { formatDistanceToNow, subHours } from 'date-fns';
import type { ChatSession } from "@/lib/types";

// Mock data for recent sessions
const MOCK_SESSIONS: ChatSession[] = [
    { id: '1', userId: 'mock-user-123', title: 'Evening Reflection', updatedAt: subHours(new Date(), 2) },
    { id: '2', userId: 'mock-user-123', title: 'Feeling a bit down', updatedAt: subHours(new Date(), 20) },
    { id: '3', userId: 'mock-user-123', title: 'A good day', updatedAt: subHours(new Date(), 48) },
];


export default function RecentActivity() {
  const recentSessions = MOCK_SESSIONS;

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
                  {session.updatedAt && (
                    <p className="text-sm text-muted-foreground">
                      Last activity {formatDistanceToNow(session.updatedAt, { addSuffix: true })}
                    </p>
                  )}
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
