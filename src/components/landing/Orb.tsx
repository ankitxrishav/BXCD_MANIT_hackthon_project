'use client';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function Orb({ className }: { className?: string }) {
    return (
        <motion.div
            animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 10, -10, 0],
                x: [0, 5, -5, 0],
                y: [0, 5, -5, 0],
            }}
            transition={{
                duration: 10,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'reverse'
            }}
            className={cn(
                'rounded-full blur-3xl opacity-50',
                className
            )}
        />
    )
}
