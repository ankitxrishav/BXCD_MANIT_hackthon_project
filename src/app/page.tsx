
import Link from 'next/link';
import { BrainCircuit, HeartHandshake, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/layout/Logo';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Logo />
          <Button asChild>
            <Link href="/login">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight text-primary">
            Find your balance with Mindwell
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-foreground/80">
            Your personal AI companion for tracking mood, understanding your emotions, and fostering mental well-being.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/login">Start Your Journey</Link>
            </Button>
          </div>
        </section>

        <section className="bg-secondary/50 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-headline font-bold text-center text-primary">
              How Mindwell Helps You
            </h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/50 text-accent-foreground">
                    <HeartHandshake className="h-6 w-6" />
                  </div>
                  <CardTitle className="mt-4 font-headline">AI-Powered Chat</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80">
                    Engage in meaningful conversations with your AI companion. Talk about your day, your feelings, or anything on your mind.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/50 text-accent-foreground">
                    <BrainCircuit className="h-6 w-6" />
                  </div>
                  <CardTitle className="mt-4 font-headline">Sentiment Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80">
                    Gain insights into your emotional patterns. Mindwell analyzes your conversations to help you understand your mood trends over time.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/50 text-accent-foreground">
                    <Mic className="h-6 w-6" />
                  </div>
                  <CardTitle className="mt-4 font-headline">Personalized Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80">
                    Receive gentle, personalized recommendations and prompts based on your conversations to support your mental wellness journey.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-foreground/60">
        <p>&copy; {new Date().getFullYear()} Mindwell. All rights reserved.</p>
      </footer>
    </div>
  );
}
