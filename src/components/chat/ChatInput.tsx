
'use client';

import { useState, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SendHorizonal } from 'lucide-react';
import VoiceRecorder from './VoiceRecorder';

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

  const handleTranscription = (transcribedText: string) => {
    setText(prev => prev ? `${prev} ${transcribedText}` : transcribedText);
    textareaRef.current?.focus();
  };

  return (
    <div className="flex items-start gap-2">
      <Textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message or record your voice..."
        className="flex-1 resize-none pr-20"
        rows={1}
        disabled={isLoading}
      />
      <div className="flex flex-col gap-2">
        <Button onClick={handleSendClick} disabled={isLoading || !text.trim()} size="icon">
          <SendHorizonal className="h-5 w-5" />
          <span className="sr-only">Send Message</span>
        </Button>
        <VoiceRecorder onTranscription={handleTranscription} />
      </div>
    </div>
  );
}
