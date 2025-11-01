
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import GridPattern from './GridPattern';

export default function Hero() {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-40 text-center relative overflow-hidden">
       <GridPattern />
      <div className="max-w-4xl mx-auto relative">
        <div className="mb-4 inline-block rounded-full glass-card px-4 py-1 text-sm font-medium text-primary">
            Your journey to mental wellness starts here.
        </div>
        <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight text-foreground">
          Meet Your Personal AI Health Companion
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
          Emodash offers real-time emotional insights, personalized wellness
          recommendations, and compassionate AI support to empower your mental
          health journey.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Button asChild size="lg" className="shadow-lg shadow-primary/20 glow-sm">
            <Link href="/login">Start for Free &rarr;</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="bg-background/20 backdrop-blur-sm">
            <Link href="#features">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
