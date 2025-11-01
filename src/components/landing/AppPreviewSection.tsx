'use client';
import { BentoGrid, BentoGridItem } from './BentoGrid';
import { Bot, ChartNoAxesColumnIncreasing, Wind, BrainCircuit } from 'lucide-react';
import AnimatedWrapper, { AnimatedItem } from './AnimatedWrapper';
import Image from 'next/image';

const ImageHeader = ({ src, alt }: { src: string; alt: string }) => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden bg-dot-white/[0.2] border-white/10 border">
        <Image 
            src={src}
            alt={alt}
            width={500}
            height={300}
            className="object-cover w-full h-full group-hover/bento:scale-105 transition-transform duration-200"
        />
    </div>
);

const items = [
    {
      title: 'AI Chat Interface',
      description: 'A clean, calming space for your conversations with Emodash.',
      header: <ImageHeader src="/img/ai.jpg" alt="AI Chat Interface Preview" />,
      icon: <Bot className="h-4 w-4 text-neutral-500" />,
      className: "md:col-span-3",
    },
    {
      title: 'Emotion Graph',
      description: 'Track your mood fluctuations over time to spot trends.',
      header: <ImageHeader src="/img/Emotion Graph.png" alt="Emotion Graph Preview" />,
      icon: <ChartNoAxesColumnIncreasing className="h-4 w-4 text-neutral-500" />,
      className: "md:col-span-2",
    },
    {
      title: 'Guided Activities',
      description: 'Follow guided exercises for breathing and meditation.',
      header: <ImageHeader src="/img/Guided Breathing.png" alt="Guided Breathing Preview" />,
      icon: <Wind className="h-4 w-4 text-neutral-500" />,
      className: "md:col-span-2",
    },
    {
      title: 'Personal Insights',
      description: 'Understand your emotional landscape with AI-driven summaries.',
      header: <ImageHeader src="/img/Personal Insights.jpg" alt="Personal Insights Preview" />,
      icon: <BrainCircuit className="h-4 w-4 text-neutral-500" />,
      className: "md:col-span-3",
    },
  ];

export default function AppPreviewSection() {
    return (
        <section id="preview" className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <AnimatedWrapper type="stagger-children" staggerDelay={0.05}>
                <div className="text-center max-w-3xl mx-auto">
                    <AnimatedItem>
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Your Personal Wellness Dashboard
                        </h2>
                    </AnimatedItem>
                    <AnimatedItem>
                        <p className="mt-4 text-lg text-muted-foreground">
                            An intuitive interface to visualize your progress and access supportive tools, beautifully designed for clarity and focus.
                        </p>
                    </AnimatedItem>
                </div>
                <div className="mt-16">
                    <BentoGrid className="max-w-5xl mx-auto">
                        {items.map((item, i) => (
                            <AnimatedItem key={i} className={item.className}>
                                <BentoGridItem
                                    title={item.title}
                                    description={item.description}
                                    header={item.header}
                                    icon={item.icon}
                                />
                            </AnimatedItem>
                        ))}
                    </BentoGrid>
                </div>
            </AnimatedWrapper>
        </section>
    );
}
