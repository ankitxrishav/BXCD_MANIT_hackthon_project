
'use client';

import { motion, useScroll, useTransform, MotionProps } from 'framer-motion';
import { useRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedWrapperProps extends MotionProps {
  children: ReactNode;
  className?: string;
  type: 'parallax-hero' | 'stagger-children' | 'fade-in';
  staggerDelay?: number;
}

const animationVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AnimatedWrapper({
  children,
  className,
  type,
  staggerDelay = 0.1,
  ...props
}: AnimatedWrapperProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  if (type === 'parallax-hero') {
    return (
      <div ref={ref} className={cn('relative', className)}>
        <motion.div style={{ y }} {...props}>
          {children}
        </motion.div>
      </div>
    );
  }

  if (type === 'stagger-children') {
    return (
      <motion.div
        ref={ref}
        variants={{
          visible: {
            transition: {
              staggerChildren: staggerDelay,
            },
          },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  if (type === 'fade-in') {
    return (
      <motion.div
        variants={animationVariants}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={className}>{children}</div>;
}

export const AnimatedItem = ({ children, className }: { children: ReactNode, className?: string }) => (
  <motion.div variants={animationVariants} className={className}>
    {children}
  </motion.div>
);
