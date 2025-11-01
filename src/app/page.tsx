
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import Logo from '@/components/layout/Logo';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Testimonials from '@/components/landing/Testimonials';
import Footer from '@/components/landing/Footer';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sticky top-4 z-50">
        <div className="flex items-center justify-between rounded-full p-2 pl-4 glass-card shadow-xl">
          <Logo />
          <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
            <Link href="#features" className={cn(buttonVariants({variant: "ghost", size: "sm"}), "text-foreground/80")}>
              Features
            </Link>
            <Link href="#testimonials" className={cn(buttonVariants({variant: "ghost", size: "sm"}), "text-foreground/80")}>
              Testimonials
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
                <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild size="sm" className="shadow-lg shadow-primary/20 glow">
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
