
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Benefits from '@/components/Benefits';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <div className="container mx-auto px-4 py-6 text-center">
          {user ? (
            <div className="flex justify-center gap-4 my-8">
              <Button asChild size="lg">
                <Link to="/questions">Practice Questions</Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link to="/dashboard">View Dashboard</Link>
              </Button>
            </div>
          ) : (
            <div className="my-8">
              <p className="text-lg mb-4">Sign in to start practicing</p>
            </div>
          )}
        </div>
        <Features />
        <Benefits />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
