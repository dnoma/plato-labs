
import React from 'react';
import { Button } from '@/components/ui/button';
import GlassCard from '@/components/ui-custom/GlassCard';

const Hero = () => {
  return (
    <section className="pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background to-transparent"></div>
      
      <div className="max-w-7xl mx-auto relative">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="animate-fade-in-down mb-6">
            <span className="bg-plato-100 text-plato-800 text-xs font-medium px-3 py-1 rounded-full inline-block">
              Revolutionizing Bar Exam Preparation
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in leading-tight text-balance">
            <span className="text-gradient">Accelerate</span> Your Path to 
            <br className="hidden md:block" /> Legal Success
          </h1>
          
          <p className="text-muted-foreground text-lg md:text-xl mb-10 max-w-2xl animate-fade-in animate-delay-100 text-balance">
            PLATO reduces bar exam preparation from months to weeks with a LeetCode-style approach to legal practice questions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-in animate-delay-200">
            <Button size="lg" className="bg-plato-600 hover:bg-plato-700 text-white px-8">
              Get Started Free
            </Button>
            <Button variant="outline" size="lg" className="border-plato-300 text-plato-900 hover:bg-plato-50">
              See How It Works
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full animate-fade-in animate-delay-300">
            <GlassCard className="text-center">
              <h3 className="text-4xl font-bold mb-2 text-plato-900">80%</h3>
              <p className="text-muted-foreground">Less Study Time</p>
            </GlassCard>
            
            <GlassCard className="text-center">
              <h3 className="text-4xl font-bold mb-2 text-plato-900">5,000+</h3>
              <p className="text-muted-foreground">Practice Questions</p>
            </GlassCard>
            
            <GlassCard className="text-center">
              <h3 className="text-4xl font-bold mb-2 text-plato-900">94%</h3>
              <p className="text-muted-foreground">Pass Rate</p>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
