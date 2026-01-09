import { Navigation } from '../components/Navigation';
import { Hero } from '../components/Hero';
import { HowItWorks } from '../components/HowItWorks';
import { Features } from '../components/Features';
import { Testimonials } from '../components/Testimonials';
import { CTA } from '../components/CTA';
import { Footer } from '../components/Footer';

interface HomeProps {
  onOpenDemo: () => void;
}

export function Home({ onOpenDemo }: HomeProps) {
  return (
    <>
      <Navigation />
      <Hero onOpenDemo={onOpenDemo} />
      <HowItWorks />
      <Features />
      <Testimonials />
      <CTA onOpenDemo={onOpenDemo} />
      <Footer />
    </>
  );
}