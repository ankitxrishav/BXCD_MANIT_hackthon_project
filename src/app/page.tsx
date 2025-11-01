
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Logo from '@/components/layout/Logo';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Testimonials from '@/components/landing/Testimonials';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="#features" className="transition-colors hover:text-primary text-foreground/60">
              Features
            </Link>
            <Link href="#testimonials" className="transition-colors hover:text-primary text-foreground/60">
              Testimonials
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
                <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <Hero />
        <Features />
        <Testimonials />
      </main>

      <Footer />
    </div>
  );
}
