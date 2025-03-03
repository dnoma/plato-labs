
import React from 'react';
import { Button } from '@/components/ui/button';
import AnimatedNumber from '@/components/ui-custom/AnimatedNumber';
import { Clock, Lightbulb, TrendingUp } from 'lucide-react';

const Benefits = () => {
  return (
    <section id="benefits" className="py-20 px-6 bg-plato-50 relative">
      <div className="absolute inset-0 bg-grid opacity-40"></div>
      
      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="bg-plato-100 text-plato-800 text-xs font-medium px-3 py-1 rounded-full inline-block mb-4">
              Benefits
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
              Reduce Your Study Time from <span className="text-gradient">Months to Weeks</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 text-balance">
              Traditional bar exam prep takes 10-12 weeks of full-time study. PLATO's targeted approach can get you fully prepared in as little as 3 weeks.
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="bg-plato-100 p-2 rounded-full mt-1">
                  <Clock className="h-5 w-5 text-plato-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Save Valuable Time</h3>
                  <p className="text-muted-foreground">Focus on what matters most with our targeted practice approach.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-plato-100 p-2 rounded-full mt-1">
                  <Lightbulb className="h-5 w-5 text-plato-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Learn More Effectively</h3>
                  <p className="text-muted-foreground">Our spaced repetition system ensures long-term retention of key concepts.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-plato-100 p-2 rounded-full mt-1">
                  <TrendingUp className="h-5 w-5 text-plato-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Increase Pass Probability</h3>
                  <p className="text-muted-foreground">Our users pass the bar at a rate 24% higher than the national average.</p>
                </div>
              </div>
            </div>
            
            <Button className="bg-plato-600 hover:bg-plato-700 text-white">
              Start Saving Time Now
            </Button>
          </div>
          
          <div className="bg-white rounded-xl shadow-xl p-8 relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-plato-100 rounded-full opacity-50"></div>
            <div className="absolute -left-12 -bottom-12 w-36 h-36 bg-plato-100 rounded-full opacity-30"></div>
            
            <div className="relative">
              <h3 className="text-2xl font-bold mb-8 text-center">PLATO vs. Traditional Prep</h3>
              
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Traditional Method</span>
                    <span className="font-bold">
                      <AnimatedNumber value={400} suffix="+ hours" />
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className="bg-gray-400 h-2.5 rounded-full w-full"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">PLATO Method</span>
                    <span className="font-bold text-plato-700">
                      <AnimatedNumber value={120} suffix=" hours" />
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className="bg-plato-500 h-2.5 rounded-full w-[30%]"></div>
                  </div>
                </div>
                
                <div className="pt-8 border-t">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-2">Average Time Savings</p>
                    <p className="text-5xl font-bold text-plato-700">
                      <AnimatedNumber value={70} suffix="%" />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
