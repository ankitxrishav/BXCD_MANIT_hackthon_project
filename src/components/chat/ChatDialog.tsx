'use client';

import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import ChatClient from './ChatClient';

interface ChatDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function ChatDialog({ isOpen, onOpenChange }: ChatDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 border-none bg-transparent shadow-none">
        <ChatClient />
      </DialogContent>
    </Dialog>
  );
}
