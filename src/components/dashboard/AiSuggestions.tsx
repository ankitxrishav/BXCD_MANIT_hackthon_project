
"use client"

import { useChat } from "@/context/ChatProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

export default function AiSuggestions() {
  const { suggestions } = useChat();

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Suggestions</CardTitle>
        <CardDescription>Personalized recommendations based on your conversation.</CardDescription>
      </CardHeader>
      <CardContent>
        {suggestions && suggestions.length > 0 ? (
          <ul className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent-foreground shrink-0 mt-1">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <p className="text-sm text-foreground/90">{suggestion}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex h-24 items-center justify-center text-center text-muted-foreground">
            <div>
              <p>No suggestions yet.</p>
              <p className="text-sm">Your AI companion will offer tips as you chat.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
