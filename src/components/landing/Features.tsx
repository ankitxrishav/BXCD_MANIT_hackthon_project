
import { BrainCircuit, Zap, HeartPulse, ShieldCheck, ChartColumn } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: BrainCircuit,
    title: 'Real-Time Emotion Detection',
    description: 'Our AI analyzes your conversation in real-time to understand your emotional state, providing you with immediate feedback and awareness.',
  },
  {
    icon: Zap,
    title: 'Personalized AI Suggestions',
    description: 'Receive smart, actionable recommendations tailored to your current mood, including meditation, breathing exercises, and journaling prompts.',
  },
  {
    icon: ChartColumn,
    title: 'Track Your Mood Over Time',
    description: 'Visualize your emotional journey with insightful charts and analytics, helping you identify patterns and track your progress towards mental wellness.',
  },
  {
    icon: HeartPulse,
    title: 'Holistic Health Companion',
    description: "Emodash is more than a chatbot. It's your personal companion for tracking activities, celebrating progress, and supporting your overall well-being.",
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Private by Design',
    description: 'Your conversations and data are end-to-end encrypted and stored securely. Your privacy is our top priority, always.',
  },
];

export default function Features() {
  return (
    <section id="features" className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">
                A Smarter Way to Wellness
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
                Emodash is packed with features designed to provide compassionate support and actionable insights for your mental health journey.
            </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
            <Card key={index} className="text-left bg-card shadow-sm border-border/60 transform transition-transform duration-300 hover:-translate-y-2">
                <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="mt-4 font-bold text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-muted-foreground">
                    {feature.description}
                </p>
                </CardContent>
            </Card>
            ))}
        </div>
    </section>
  );
}
