'use client';
import { cn } from '@/lib/utils';
import { motion } from "framer-motion";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-4 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
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
        "row-span-1 rounded-2xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 bg-card/80 justify-between flex flex-col space-y-4 border border-transparent",
        className
      )}
    >
      <div className="flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden bg-dot-white/[0.2] border-white/10 border">
          {header}
      </div>
      <div className="group-hover/bento:translate-x-1 transition duration-200">
        <div className="flex items-center gap-2">
            {icon}
            <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200">
                {title}
            </div>
        </div>
        <div className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300 mt-2">
          {description}
        </div>
      </div>
    </div>
  );
};