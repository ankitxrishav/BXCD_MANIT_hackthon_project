import HeroSection from '@/components/landing/HeroSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import AppPreviewSection from '@/components/landing/AppPreviewSection';
import FeaturesGridSection from '@/components/landing/FeaturesGridSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import CTASection from '@/components/landing/CTASection';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <HowItWorksSection />
        <AppPreviewSection />
        <FeaturesGridSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
