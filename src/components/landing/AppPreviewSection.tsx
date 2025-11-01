'use client';
import { BentoGrid, BentoGridItem } from './BentoGrid';
import { Bot, ChartNoAxesColumnIncreasing, Wind, BrainCircuit } from 'lucide-react';
import AnimatedWrapper, { AnimatedItem } from './AnimatedWrapper';
import Image from 'next/image';

const ImageHeader = ({ src, alt }: { src: string, alt: string }) => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200/50 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100/50 items-center justify-center overflow-hidden">
        <Image 
            src={src}
            alt={alt}
            width={500}
            height={300}
            className="object-cover w-full h-full"
        />
    </div>
);

const items = [
    {
      title: 'AI Chat Interface',
      description: 'A clean, calming space for your conversations with Emodash.',
      header: <ImageHeader src="/img/ai.jpg" alt="AI Chat Interface Preview" />,
      className: 'md:col-span-2',
      icon: <Bot className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: 'Emotion Graph',
      description: 'Track your mood fluctuations over time to spot trends.',
      header: <ImageHeader src="/img/Emotion Graph.png" alt="Emotion Graph Preview" />,
      className: 'md:col-span-1',
      icon: <ChartNoAxesColumnIncreasing className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: 'Guided Breathing',
      description: 'Follow the animated guide to find your center.',
      header: <ImageHeader src="/img/Guided Breathing.png" alt="Guided Breathing Preview" />,
      className: 'md:col-span-1',
      icon: <Wind className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: 'Personal Insights',
      description: 'Understand your emotional landscape with AI-driven summaries.',
      header: <ImageHeader src="/img/Personal Insights.jpg" alt="Personal Insights Preview" />,
      className: 'md:col-span-2',
      icon: <BrainCircuit className="h-4 w-4 text-neutral-500" />,
    },
  ];

export default function AppPreviewSection() {
    return (
        <section id="preview" className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold">
                    Your Personal Wellness Dashboard
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    An intuitive interface to visualize your progress and access supportive tools.
                </p>
            </div>
            <AnimatedWrapper type="stagger-children" className="mt-16">
                <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]">
                    {items.map((item, i) => (
                        <AnimatedItem key={i}>
                            <BentoGridItem
                                title={item.title}
                                description={item.description}
                                header={item.header}
                                className={item.className}
                                icon={item.icon}
                            />
                        </AnimatedItem>
                    ))}
                </BentoGrid>
            </AnimatedWrapper>
        </section>
    );
}