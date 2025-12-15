import {
  Navbar,
  HeroSection,
  TrustBar,
  ProblemSection,
  SolutionSection,
  FeaturesSection,
  HowItWorksSection,
  AIAgentsSection,
  UseCasesSection,
  PricingSection,
  TestimonialsSection,
  FAQSection,
  FinalCTASection,
  FooterSection,
} from '@/components/landing';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Fixed Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Trust Bar */}
      <TrustBar />
      
      {/* Problem Section */}
      <ProblemSection />
      
      {/* Solution Section */}
      <SolutionSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* How It Works */}
      <HowItWorksSection />
      
      {/* AI Agents */}
      <AIAgentsSection />
      
      {/* Use Cases */}
      <UseCasesSection />
      
      {/* Pricing */}
      <PricingSection />
      
      {/* Testimonials */}
      <TestimonialsSection />
      
      {/* FAQ */}
      <FAQSection />
      
      {/* Final CTA */}
      <FinalCTASection />
      
      {/* Footer */}
      <FooterSection />
    </main>
  );
}
