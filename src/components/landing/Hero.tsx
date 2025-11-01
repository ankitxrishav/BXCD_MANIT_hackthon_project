
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-32 text-center">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
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
          <Button asChild size="lg">
            <Link href="/login">Start for Free &rarr;</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="#features">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
