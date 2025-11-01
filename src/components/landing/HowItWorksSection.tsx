import { MessageCircle, ScanFace, Sparkles, TrendingUp } from 'lucide-react';
import Image from 'next/image';

const steps = [
    {
        icon: MessageCircle,
        title: "1. Talk to the AI",
        description: "Start a conversation via text or voice. Share what's on your mind in a safe, non-judgmental space.",
    },
    {
        icon: ScanFace,
        title: "2. Detect Your Emotion",
        description: "Our AI gently analyzes your words to understand your emotional state in real-time.",
    },
    {
        icon: Sparkles,
        title: "3. Get Real-Time Support",
        description: "Receive empathetic responses and personalized suggestions, like breathing exercises or journaling prompts.",
    },
    {
        icon: TrendingUp,
        title: "4. Monitor Mood Trends",
        description: "Use your personal dashboard to see your mood patterns and track your wellness journey over time.",
    }
];

const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
    <div className="rounded-2xl flex flex-col text-center glass-card transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl overflow-hidden p-6">
        <div className="flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4 ring-2 ring-primary/20 bg-card border-4 border-card">
                <Icon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </div>
    </div>
);


export default function HowItWorksSection() {
    return (
        <section id="how-it-works" className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold">
                    How It Works
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    A simple, private, and supportive process to help you navigate your feelings.
                </p>
            </div>
            
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {steps.map(step => (
                    <FeatureCard 
                        key={step.title}
                        icon={step.icon}
                        title={step.title}
                        description={step.description}
                    />
                ))}
            </div>
        </section>
    );
}
