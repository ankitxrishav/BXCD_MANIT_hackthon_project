import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';
import AnimatedGridPattern from './AnimatedGridPattern';
import Orb from './Orb';
import AnimatedWrapper from './AnimatedWrapper';

export default function HeroSection() {
  return (
    <section className="container mx-auto py-24 md:py-32 relative overflow-hidden">
        <div className="px-4 sm:px-6 lg:px-8 text-center relative z-10">
            
            <AnimatedGridPattern
                className="[mask-image:radial-gradient(500px_circle_at_center,white,transparent)] inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
            />
            <Orb className="absolute -top-60 -left-40 w-[40rem] h-[40rem] bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
            <Orb className="absolute -bottom-60 -right-40 w-[40rem] h-[40rem] bg-gradient-to-br from-teal-500/20 to-green-500/20" />
            

            <div className="max-w-4xl mx-auto">

                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
                    Find Your Calm in the Digital Age
                </h1>

                <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
                    Emodash is your private AI companion for mental wellness, offering a safe space to talk, reflect, and grow.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Button asChild size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/20">
                        <Link href="/login">
                            Try Demo
                        </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="w-full sm:w-auto bg-transparent backdrop-blur-sm">
                        <Link href="#how-it-works">
                            Learn More
                        </Link>
                    </Button>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                    <span>
                        Private, Encrypted, and Secure.
                    </span>
                </div>
            </div>

            {/* Hologram Chat UI */}
            <AnimatedWrapper type="parallax-hero" className="mt-20">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10"></div>
                    <Image 
                        src="https://picsum.photos/seed/hero-chat/1200/800"
                        alt="Emodash application interface"
                        width={1200}
                        height={800}
                        className="rounded-2xl mx-auto glass-card p-2 shadow-2xl opacity-70"
                        priority
                        data-ai-hint="hologram chat"
                    />
                </div>
            </AnimatedWrapper>
        </div>
    </section>
  );
}
