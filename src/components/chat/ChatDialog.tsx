'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import ChatClient from './ChatClient';

interface ChatDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function ChatDialog({ isOpen, onOpenChange }: ChatDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] p-0 border-none glass-card shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Chat with your AI Assistant</DialogTitle>
          <DialogDescription>
            A chat window to talk with your AI companion about your mood and feelings. Suggestions and real-time emotion analysis are displayed alongside the conversation.
          </DialogDescription>
        </DialogHeader>
        <ChatClient />
      </DialogContent>
    </Dialog>
  );
}
