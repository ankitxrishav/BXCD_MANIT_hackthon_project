'use client';
import { cn } from "@/lib/utils"
import { useMotionValue, motion, useMotionTemplate } from "framer-motion"
import React from "react";

export default function AnimatedGridPattern({
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
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function onMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const maskImage = useMotionTemplate`radial-gradient(300px at ${mouseX}px ${mouseY}px, white, transparent)`;
  const style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div onMouseMove={onMouseMove} className="absolute inset-0 h-full w-full">
        <div
            className={cn(
                "pointer-events-none absolute inset-0 h-full w-full opacity-50",
                className,
            )}
            style={style}
            {...props}
        >
            <svg
                className="absolute h-full w-full fill-none stroke-white/10"
            >
                <defs>
                <pattern
                    id="grid-pattern"
                    width={width}
                    height={height}
                    patternUnits="userSpaceOnUse"
                    x={x}
                    y={y}
                >
                    <path d={`M.5 ${height}V.5H${width}`} fill="none" />
                </pattern>
                </defs>
                <rect width="100%" height="100%" strokeWidth={0} fill="url(#grid-pattern)" />
            </svg>
        </div>
    </div>
  );
}
