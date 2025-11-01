
import Link from 'next/link';
import { BrainCircuit, Zap, Heart } from 'lucide-react';
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
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight text-foreground">
            Your AI Mental Wellness Companion
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
            Real-time emotion detection, personalized wellness recommendations,
            and compassionate AI support for your mental health journey.
          </p>
          <div className="mt-10">
            <Button asChild size="lg">
              <Link href="/login">Start Conversation &rarr;</Link>
            </Button>
          </div>
        </section>

        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="text-left bg-card shadow-lg border-none">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <BrainCircuit className="h-6 w-6" />
                  </div>
                  <CardTitle className="mt-4 font-bold text-lg">Emotion Detection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Real-time AI analysis detects your emotions
                    during conversations and provides instant
                    insights.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-left bg-card shadow-lg border-none">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
                    <Zap className="h-6 w-6" />
                  </div>
                  <CardTitle className="mt-4 font-bold text-lg">Smart Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Personalized wellness suggestions
                    including meditation, breathing exercises,
                    and journaling.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-left bg-card shadow-lg border-none">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-500">
                    <Heart className="h-6 w-6" />
                  </div>
                  <CardTitle className="mt-4 font-bold text-lg">Privacy First</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your conversations and emotional data are
                    completely private and never stored
                    permanently.
                  </p>
                </CardContent>
              </Card>
            </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Emodash. All rights reserved.</p>
      </footer>
    </div>
  );
}
