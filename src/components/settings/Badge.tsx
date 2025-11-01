
'use client';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { Badge as BadgeType } from '@/lib/types';
import * as LucideIcons from 'lucide-react';

interface BadgeProps {
  badge: BadgeType;
}

const Icon = ({ name, ...props }: { name: string } & LucideIcons.LucideProps) => {
    const LucideIcon = (LucideIcons as any)[name];
    if (!LucideIcon) {
        return <LucideIcons.Award {...props} />;
    }
    return <LucideIcon {...props} />;
};


export default function Badge({ badge }: BadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col items-center gap-2">
            <div
              className={cn(
                'flex h-20 w-20 items-center justify-center rounded-full border-4 transition-all duration-300',
                badge.achieved
                  ? 'border-yellow-400 bg-yellow-100 text-yellow-600'
                  : 'border-muted bg-muted text-muted-foreground'
              )}
            >
              <Icon name={badge.icon} className="h-10 w-10" />
            </div>
            <p className={cn(
                "text-sm text-center font-medium",
                !badge.achieved && 'text-muted-foreground'
            )}>
                {badge.name}
            </p>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{badge.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
