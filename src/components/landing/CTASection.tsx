import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Orb from './Orb';

export default function CTASection() {
    return (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="relative text-center bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-teal-500/10 p-12 rounded-3xl overflow-hidden">
                <Orb className="absolute -top-20 -left-20 w-60 h-60 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
                <Orb className="absolute -bottom-20 -right-20 w-60 h-60 bg-gradient-to-br from-teal-500/20 to-green-500/20" />
                
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold">
                        Start Your Mental Wellness Journey
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Join Emodash today and take the first step towards a calmer, more mindful you. It's free to get started.
                    </p>
                    <Button asChild size="lg" className="mt-8 shadow-lg shadow-primary/20">
                        <Link href="/login">
                            Get Started for Free
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
