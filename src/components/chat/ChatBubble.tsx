
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';
import ChatDialog from './ChatDialog';
import { motion, AnimatePresence } from 'framer-motion';

const welcomeMessages = [
    "Welcome back! Ready to explore your dashboard insights?",
    "Hello there! How are you feeling today?",
    "Good to see you again. What's on your mind?",
    "Hey! Your personal wellness space is ready for you.",
];

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');

  useEffect(() => {
    // Select a random message only on the client to avoid hydration errors
    const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    setWelcomeMessage(randomMessage);

    const timer = setTimeout(() => {
      setShowWelcome(true);
    }, 1500); // Delay welcome message

    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (showWelcome) {
        const timer = setTimeout(() => {
            setShowWelcome(false);
        }, 8000); // Hide after 8 seconds
        return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  return (
    <>
      <div className="fixed bottom-6 left-6 z-50">
        <AnimatePresence>
            {showWelcome && !isOpen && (
                 <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-full mb-3 w-64 cursor-pointer"
                    onClick={() => setIsOpen(true)}
                >
                    <div className="bg-card glass-card shadow-xl rounded-lg p-4 text-sm text-foreground relative">
                       <div className="absolute -bottom-2 left-6 h-4 w-4 bg-card transform rotate-45"></div>
                       <p>{welcomeMessage}</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
        >
            <Button
            size="icon"
            className="rounded-full w-16 h-16 shadow-lg glow-shadow hover:scale-110 transition-transform"
            onClick={() => setIsOpen(true)}
            >
            <Bot className="h-8 w-8" />
            <span className="sr-only">Open Chat</span>
            </Button>
        </motion.div>
      </div>
      <ChatDialog isOpen={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
