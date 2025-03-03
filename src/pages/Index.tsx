
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
import { useQuery } from '@tanstack/react-query';
import { questionService } from '@/lib/supabase';
import GlassCard from '@/components/ui-custom/GlassCard';
import { ArrowRight, BookOpen, CheckCircle, Clock, BarChart2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const Index = () => {
  const { user } = useAuth();

  const { data: questions } = useQuery({
    queryKey: ['questions'],
    queryFn: questionService.getQuestions,
    enabled: !!user,
  });

  const { data: userProgress } = useQuery({
    queryKey: ['userProgress', user?.id],
    queryFn: () => user?.id ? questionService.getUserProgress(user.id) : Promise.resolve([]),
    enabled: !!user?.id,
  });

  // Calculate stats for the quick dashboard
  const getTotalQuestions = () => questions?.length || 0;
  const getCompletedQuestions = () => {
    if (!userProgress || !questions) return 0;
    return userProgress.filter(p => p.status === 'completed').length;
  };
  const getCompletionPercentage = () => {
    if (!questions || !questions.length) return 0;
    return Math.round((getCompletedQuestions() / getTotalQuestions()) * 100);
  };

  // Get the next question to practice
  const getNextQuestion = () => {
    if (!questions || !userProgress) return null;
    
    // First look for questions in progress
    const inProgressQuestions = questions.filter(q => 
      userProgress.some(p => p.question_id === q.id && p.status === 'in_progress')
    );
    
    if (inProgressQuestions.length > 0) {
      return inProgressQuestions[0];
    }
    
    // Then look for questions not attempted
    const notAttemptedQuestions = questions.filter(q => 
      !userProgress.some(p => p.question_id === q.id)
    );
    
    if (notAttemptedQuestions.length > 0) {
      return notAttemptedQuestions[0];
    }
    
    // If all questions are completed, return the first one
    return questions[0];
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        
        {user ? (
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Welcome back to your Bar Exam Prep</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <GlassCard className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <BarChart2 className="mr-2 h-5 w-5 text-plato-500" />
                    Your Progress
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Completion</span>
                        <span className="text-sm font-medium">{getCompletionPercentage()}%</span>
                      </div>
                      <Progress value={getCompletionPercentage()} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-background/50 p-3 rounded-md">
                        <div className="text-2xl font-bold">{getCompletedQuestions()}</div>
                        <div className="text-xs text-muted-foreground">Questions Completed</div>
                      </div>
                      <div className="bg-background/50 p-3 rounded-md">
                        <div className="text-2xl font-bold">{getTotalQuestions()}</div>
                        <div className="text-xs text-muted-foreground">Total Questions</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/dashboard">View Full Dashboard</Link>
                    </Button>
                  </div>
                </GlassCard>
                
                <GlassCard className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-plato-500" />
                    Continue Learning
                  </h3>
                  
                  {getNextQuestion() ? (
                    <>
                      <div className="space-y-3 mb-6">
                        <div className="font-medium">{getNextQuestion()?.title}</div>
                        <div className="text-sm line-clamp-2 text-muted-foreground">
                          {getNextQuestion()?.description?.replace(/<[^>]*>/g, '').substring(0, 100)}...
                        </div>
                        <div className="flex gap-2">
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                            {getNextQuestion()?.category?.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </span>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            getNextQuestion()?.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                            getNextQuestion()?.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {getNextQuestion()?.difficulty?.charAt(0).toUpperCase() + getNextQuestion()?.difficulty?.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      <Button className="w-full" asChild>
                        <Link to={`/questions/${getNextQuestion()?.id}`}>
                          Continue This Question
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                      <h4 className="text-lg font-medium mb-2">No questions available</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Start adding questions to begin your bar exam preparation
                      </p>
                    </div>
                  )}
                </GlassCard>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/questions">
                    Browse All Questions
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/dashboard">
                    View Your Dashboard
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-6 text-center">
            <div className="my-8">
              <p className="text-lg mb-4">Sign in to start preparing for the bar exam</p>
              <Button size="lg">Sign In</Button>
            </div>
          </div>
        )}
        
        <Features />
        <Benefits />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
