import Image from 'next/image';
import { BentoGrid, BentoGridItem } from './BentoGrid';
import { Bot, ChartNoAxesColumnIncreasing, Droplets, Wind } from 'lucide-react';

const Skeleton = ({ src, alt, hint }: { src: string, alt: string, hint: string }) => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100 overflow-hidden">
        <Image 
            src={src}
            alt={alt}
            width={800}
            height={600}
            className="object-cover w-full h-full"
            data-ai-hint={hint}
        />
    </div>
);

const items = [
    {
      title: 'AI Chat Interface',
      description: 'A clean, calming space for your conversations with Emodash.',
      header: <Skeleton src="https://picsum.photos/seed/ai-chat/800/600" alt="Chat UI" hint="ai chat" />,
      className: 'md:col-span-2',
      icon: <Bot className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: 'Emotion Graph',
      description: 'Track your mood fluctuations over time to spot trends.',
      header: <Skeleton src="https://picsum.photos/seed/dashboard-graph/800/600" alt="Emotion Graph" hint="dashboard graph" />,
      className: '',
      icon: <ChartNoAxesColumnIncreasing className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: 'Guided Breathing',
      description: 'Follow the animated guide to find your center.',
      header: <Skeleton src="https://picsum.photos/seed/mindfulness-app/800/600" alt="Breathing Animation" hint="mindfulness app" />,
      className: '',
      icon: <Wind className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: 'Personal Insights',
      description: 'Understand your emotional landscape with AI-driven summaries.',
      header: <Skeleton src="https://picsum.photos/seed/analytics-dashboard/800/600" alt="Personal Insights" hint="analytics dashboard" />,
      className: 'md:col-span-2',
      icon: <Droplets className="h-4 w-4 text-neutral-500" />,
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
            <BentoGrid className="mt-16">
                {items.map((item, i) => (
                    <BentoGridItem
                        key={i}
                        title={item.title}
                        description={item.description}
                        header={item.header}
                        className={item.className}
                        icon={item.icon}
                    />
                ))}
            </BentoGrid>
        </section>
    );
}
