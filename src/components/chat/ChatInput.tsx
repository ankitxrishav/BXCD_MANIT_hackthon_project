
'use client';

import { useState, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SendHorizonal } from 'lucide-react';

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendClick = () => {
    if (text.trim()) {
      onSend(text);
      setText('');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendClick();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 relative">
        <Textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          className="flex-1 resize-none pr-12 rounded-full bg-input border-none"
          rows={1}
          disabled={isLoading}
        />
      </div>
      <Button 
        onClick={handleSendClick} 
        disabled={isLoading || !text.trim()} 
        size="icon"
        className="rounded-full w-10 h-10 bg-primary/90 text-primary-foreground hover:bg-primary"
    >
        <SendHorizonal className="h-5 w-5" />
        <span className="sr-only">Send Message</span>
      </Button>
    </div>
  );
}
