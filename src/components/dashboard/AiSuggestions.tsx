
"use client"

import { useChat } from "@/context/ChatProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lightbulb, Gift } from "lucide-react";
import { motion } from 'framer-motion';
import { Skeleton } from "../ui/skeleton";

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

export default function AiSuggestions() {
  const { suggestions, isLoading } = useChat();

  // If there's only one suggestion, it's a "reward" message.
  const isReward = suggestions.length === 1;

  return (
    <motion.div variants={itemVariants} className="h-full">
        <Card className="h-full transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
        <CardHeader>
            <CardTitle>AI Suggestions</CardTitle>
            <CardDescription>
                {isReward 
                    ? "A positive note from your AI companion." 
                    : "Personalized recommendations based on your conversation."
                }
            </CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            ) : suggestions && suggestions.length > 0 ? (
            <ul className="space-y-4">
                {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground shrink-0 mt-1">
                    {isReward ? <Gift className="h-5 w-5" /> : <Lightbulb className="h-5 w-5" />}
                    </div>
                    <p className="text-sm text-foreground/90">{suggestion}</p>
                </li>
                ))}
            </ul>
            ) : (
            <div className="flex h-40 items-center justify-center text-center text-muted-foreground">
                <div>
                <p>No suggestions yet.</p>
                <p className="text-sm">Your AI companion will offer tips as you chat.</p>
                </div>
            </div>
            )}
        </CardContent>
        </Card>
    </motion.div>
  );
}
