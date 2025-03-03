
import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import About from '@/components/landing/About';
import Testimonials from '@/components/landing/Testimonials';
import Pricing from '@/components/landing/Pricing';
import CallToAction from '@/components/landing/CallToAction';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <About />
      <Testimonials />
      <Pricing />
      <CallToAction />
    </div>
  );
};

export default Index;
