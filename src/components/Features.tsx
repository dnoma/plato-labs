
import React from 'react';
import GlassCard from '@/components/ui-custom/GlassCard';
import { CheckCircle, Code, BookOpen, Goal } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Code className="h-8 w-8 text-plato-600" />,
      title: "LeetCode-Style Practice",
      description: "Practice with real bar exam questions in a coding-style environment with immediate feedback."
    },
    {
      icon: <BookOpen className="h-8 w-8 text-plato-600" />,
      title: "Comprehensive Library",
      description: "Access thousands of practice questions covering all areas of law tested on the bar exam."
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-plato-600" />,
      title: "Adaptive Learning",
      description: "Our platform adjusts to your strengths and weaknesses, focusing your study time where you need it most."
    },
    {
      icon: <Goal className="h-8 w-8 text-plato-600" />,
      title: "Progress Tracking",
      description: "Monitor your improvement with detailed analytics and performance metrics."
    }
  ];

  return (
    <section id="features" className="py-20 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="bg-plato-100 text-plato-800 text-xs font-medium px-3 py-1 rounded-full inline-block mb-4">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            A <span className="text-gradient">Smarter</span> Way to Study
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
            PLATO combines cutting-edge technology with legal expertise to create the most efficient bar exam preparation platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <GlassCard 
              key={index} 
              className="hover-lift"
              hoverEffect
            >
              <div className="flex flex-col">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
