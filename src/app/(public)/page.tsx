import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { Logos } from '@/components/landing/Logos';
// import { Stories } from '@/components/landing/Stories';
import { Value } from '@/components/landing/Value';
import { Testimonials } from '@/components/landing/Testimonials';
// import { Timeline } from '@/components/landing/Timeline';
// import { Results } from '@/components/landing/Results';
import { FAQ } from '@/components/landing/FAQ';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Logos />
        {/* <Stories /> */}
        <Value />
        <Testimonials />
        {/* <Timeline /> */}
        {/* <Results /> */}
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
