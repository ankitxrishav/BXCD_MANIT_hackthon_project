'use client';
import { cn } from '@/lib/utils';

// This is a dummy component now as the grid is defined in the section itself.
// Kept for structural consistency if you want to add complex grids later.
export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-8", className)}>
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "group/bento flex h-full flex-col justify-between space-y-4 rounded-2xl bg-card/80 p-4 shadow-input transition duration-200 hover:shadow-xl",
        className
      )}
    >
      {header}
      <div className="transition duration-200 group-hover/bento:translate-x-1">
        <div className="flex items-center gap-2">
            {icon}
            <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200">
                {title}
            </div>
        </div>
        <div className="mt-2 font-sans text-xs font-normal text-neutral-600 dark:text-neutral-300">
          {description}
        </div>
      </div>
    </div>
  );
};
