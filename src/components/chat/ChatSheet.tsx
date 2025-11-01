
'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';
import ChatClient from './ChatClient';

interface ChatSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function ChatSheet({ isOpen, onOpenChange }: ChatSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full md:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-6 pb-2">
          <SheetTitle>AI Companion</SheetTitle>
          <SheetDescription>
            Talk about your feelings. I'm here to listen.
          </SheetDescription>
        </SheetHeader>
        <ChatClient />
      </SheetContent>
    </Sheet>
  );
}
