import React from "react";
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section id="how-it-works" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-plato-900 rounded-2xl p-10 md:p-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-[10%] w-72 h-72 bg-plato-500 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 right-[10%] w-80 h-80 bg-plato-700 rounded-full filter blur-3xl"></div>
          </div>

          <div className="relative text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white text-balance">
              Start Preparing Smarter Today
            </h2>
            <p className="text-plato-100 text-lg mb-10 text-balance">
              Join thousands of law students who have accelerated their bar exam
              preparation with PLATO. Get access to all practice questions and
              features free for 7 days.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white hover:bg-gray-100 text-plato-900"
              >
                Start Free Trial
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white hover:bg-gray-100 text-plato-900"
              >
                Book a Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
