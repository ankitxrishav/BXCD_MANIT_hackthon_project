'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ReactNode } from 'react';
import { Skeleton } from '../ui/skeleton';

interface ActivityDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  description: string;
  isLoading: boolean;
  content: ReactNode;
}

export default function ActivityDialog({
  isOpen,
  onOpenChange,
  title,
  description,
  isLoading,
  content,
}: ActivityDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg glass-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="mt-4 prose prose-sm dark:prose-invert max-w-none">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            content
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
