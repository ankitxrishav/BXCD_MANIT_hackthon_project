
"use client"

import { useChat } from "@/context/ChatProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BrainCircuit } from "lucide-react";

export default function MoodAnalysis() {
  const { moodSummary, messages } = useChat();
  const hasData = messages.some(m => m.sentiment);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Mood Analysis</CardTitle>
        <CardDescription>A real-time analysis of your mood based on the current conversation.</CardDescription>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <BrainCircuit className="h-8 w-8 text-accent-foreground/80 mt-1" />
              <p className="text-foreground/90">{moodSummary || "Start chatting to get your mood summary..."}</p>
            </div>
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center text-center text-muted-foreground">
            <div>
              <p>No mood data available yet.</p>
              <p className="text-sm">Start a chat to see your mood trends here.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
