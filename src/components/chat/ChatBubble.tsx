
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import ChatDialog from './ChatDialog';

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-1/2 translate-x-1/2 z-50">
        <Button
          size="icon"
          className="rounded-full w-16 h-16 shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="h-8 w-8" />
          <span className="sr-only">Open Chat</span>
        </Button>
      </div>
      <ChatDialog isOpen={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
