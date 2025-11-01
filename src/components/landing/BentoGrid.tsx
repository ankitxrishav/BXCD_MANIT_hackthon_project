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
        'grid md:auto-rows-[20rem] grid-cols-1 md:grid-cols-5 gap-4 max-w-7xl mx-auto ',
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
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className={cn(
            "row-span-1 rounded-2xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 bg-card/80 dark:bg-black/[0.05] border border-transparent justify-between flex flex-col space-y-4",
            "relative overflow-hidden transform-gpu",
            "hover:-translate-y-2",
            className
        )}
    >
        <div className="absolute inset-0 group-hover/bento:bg-gradient-to-br from-transparent to-primary/10 transition-all duration-300"></div>
        {header}
        <div className="group-hover/bento:translate-x-1 transition duration-200 relative z-10">
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
    </motion.div>
  );
};
