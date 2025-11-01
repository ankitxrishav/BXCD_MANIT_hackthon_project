
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

export default function GridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  className,
  ...props
}: {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  className?: string;
  [key: string]: any;
}) {
  const path = useMemo(() => {
    let result = [];
    for (let i = 0; i < width; i++) {
      result.push(`M${(i + 1) * (100 / width)} 0 V100`);
    }
    for (let i = 0; i < height; i++) {
      result.push(`M0 ${(i + 1) * (100 / height)} H100`);
    }
    return result.join(' ');
  }, [width, height]);

  return (
    <motion.svg
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full fill-none stroke-white/10',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      {...props}
    >
      <defs>
        <pattern
          id="grid-pattern"
          width="100%"
          height="100%"
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={path} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill="url(#grid-pattern)" />
    </motion.svg>
  );
}
