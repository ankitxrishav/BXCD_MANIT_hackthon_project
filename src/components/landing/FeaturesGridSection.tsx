import { MessageCircle, ScanFace, CalendarDays, ShieldCheck, Sparkles, HeartHandshake } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: MessageCircle,
    title: 'Voice + Text AI Chat',
    description: 'Converse naturally via voice or text, anytime you need to talk.',
  },
  {
    icon: ScanFace,
    title: 'Emotion Detection',
    description: 'AI that understands your feelings, providing empathetic and relevant support.',
  },
  {
    icon: CalendarDays,
    title: 'Mood Calendar',
    description: 'Visualize your emotional journey and identify patterns with an intuitive calendar.',
  },
  {
    icon: ShieldCheck,
    title: 'Private & Encrypted',
    description: 'Your conversations are confidential and secured with end-to-end encryption.',
  },
  {
    icon: Sparkles,
    title: 'Personalized Guidance',
    description: 'Receive actionable insights and reflections based on your unique emotional patterns.',
  },
  {
    icon: HeartHandshake,
    title: 'Safe Crisis Support',
    description: 'In moments of need, get directed to immediate, professional help and resources.',
  },
];

const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
    <div className="p-6 rounded-2xl flex flex-col items-center text-center glass-card transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4 ring-2 ring-primary/20">
            <Icon className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
    </div>
);

export default function FeaturesGridSection() {
    return (
        <section id="features" className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold">
                    Everything You Need for a Healthier Mind
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    A complete toolkit to support your mental wellness journey, designed for modern life.
                </p>
            </div>
            
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {features.map((feature) => (
                    <FeatureCard 
                        key={feature.title}
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                    />
                ))}
            </div>
        </section>
    );
}
