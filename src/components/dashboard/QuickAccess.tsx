'use client';

import { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wind, BookOpen } from "lucide-react"
import ActivityDialog from "./ActivityDialog";
import { generateMeditation } from "@/ai/flows/generate-meditation";
import { generateJournalPrompts } from "@/ai/flows/generate-journal-prompts";
import { useChat } from "@/context/ChatProvider";
import { motion } from 'framer-motion';

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

type ActivityType = 'meditation' | 'journaling' | null;

export default function QuickAccess() {
  const { latestSentiment } = useChat();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activityType, setActivityType] = useState<ActivityType>(null);
  const [dialogContent, setDialogContent] = useState<React.ReactNode>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenDialog = useCallback(async (type: 'meditation' | 'journaling') => {
    setActivityType(type);
    setIsDialogOpen(true);
    setIsLoading(true);

    try {
      if (type === 'meditation') {
        const result = await generateMeditation({ topic: latestSentiment?.emotion || 'calm' });
        setDialogContent(result.script.split('\n').map((p, i) => <p key={i}>{p}</p>));
      } else if (type === 'journaling') {
        const result = await generateJournalPrompts({ emotion: latestSentiment?.emotion || 'neutral' });
        setDialogContent(
          <ul className="list-disc pl-5 space-y-2">
            {result.prompts.map((prompt, i) => <li key={i}>{prompt}</li>)}
          </ul>
        );
      }
    } catch (error) {
        console.error(`Error generating ${type}:`, error);
        setDialogContent(<p className="text-destructive">Sorry, I couldn't generate content right now. Please try again later.</p>);
    } finally {
        setIsLoading(false);
    }
  }, [latestSentiment]);
  
  return (
    <motion.div variants={itemVariants} className="h-full">
        <Card className="transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl h-full">
        <CardHeader>
            <CardTitle>Quick Access</CardTitle>
            <CardDescription>Start an activity to support your well-being.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button variant="outline" size="lg" className="justify-start h-auto sm:h-20 text-left hover:bg-accent/50 py-4" onClick={() => handleOpenDialog('meditation')}>
                <Wind className="mr-4 h-6 w-6 text-accent-foreground/80 flex-shrink-0" />
                <div>
                    <p className="font-semibold">Guided Meditations</p>
                    <p className="text-sm font-normal text-muted-foreground hidden sm:block">Find calm and focus</p>
                </div>
            </Button>
            <Button variant="outline" size="lg" className="justify-start h-auto sm:h-20 text-left hover:bg-accent/50 py-4" onClick={() => handleOpenDialog('journaling')}>
                <BookOpen className="mr-4 h-6 w-6 text-accent-foreground/80 flex-shrink-0" />
                <div>
                    <p className="font-semibold">Journaling Prompts</p>
                    <p className="text-sm font-normal text-muted-foreground hidden sm:block">Reflect and grow</p>
                </div>
            </Button>
            </div>
        </CardContent>
        </Card>
        <ActivityDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            title={activityType === 'meditation' ? 'Guided Meditation' : 'Journaling Prompts'}
            description={
                activityType === 'meditation'
                ? `A short meditation to help you find calm.`
                : `A few prompts to help you reflect on your feelings.`
            }
            isLoading={isLoading}
            content={dialogContent}
        />
    </motion.div>
  )
}
