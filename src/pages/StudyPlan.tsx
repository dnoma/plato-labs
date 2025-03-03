
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { questionService } from '@/lib/supabase';
import { QuestionCategory } from '@/types/question';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlassCard from '@/components/ui-custom/GlassCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  BookOpen,
  BarChart3,
  BrainCircuit,
  Flame,
  Trophy,
  Clock,
  ArrowUpRight
} from 'lucide-react';

const categoryLabels: Record<QuestionCategory, string> = {
  constitutional_law: 'Constitutional Law',
  contracts: 'Contracts',
  criminal_law: 'Criminal Law',
  evidence: 'Evidence',
  property: 'Property',
  torts: 'Torts',
  civil_procedure: 'Civil Procedure',
  other: 'Other'
};

const StudyPlan = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Fetch user's questions and progress
  const { data: questions, isLoading: isQuestionsLoading } = useQuery({
    queryKey: ['questions'],
    queryFn: questionService.getQuestions,
    enabled: !!user,
  });

  const { data: userProgress, isLoading: isProgressLoading } = useQuery({
    queryKey: ['userProgress', user?.id],
    queryFn: () => user?.id ? questionService.getUserProgress(user.id) : Promise.resolve([]),
    enabled: !!user?.id,
  });
  
  const { data: studyStats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['studyStats', user?.id],
    queryFn: () => user?.id ? questionService.getUserStudyStats(user.id) : Promise.resolve(null),
    enabled: !!user?.id,
  });

  const isLoading = isQuestionsLoading || isProgressLoading || isStatsLoading;

  // Calculate recommended questions based on weaknesses and current progress
  const getRecommendedQuestions = () => {
    if (!questions || !userProgress || !studyStats) return [];
    
    // Prioritize questions from weak categories
    const weakCategories = studyStats.weaknesses;
    
    // Filter questions that are not completed
    const notCompletedIds = new Set(
      userProgress
        .filter(p => p.status !== 'completed')
        .map(p => p.question_id)
    );
    
    // Get questions from weak categories that are not completed
    let recommendedQuestions = questions.filter(q => 
      weakCategories.includes(q.category) && 
      (notCompletedIds.has(q.id) || !userProgress.some(p => p.question_id === q.id))
    );
    
    // If we don't have enough recommendations, add other not completed questions
    if (recommendedQuestions.length < 5) {
      const otherNotCompletedQuestions = questions.filter(q => 
        !weakCategories.includes(q.category) && 
        (notCompletedIds.has(q.id) || !userProgress.some(p => p.question_id === q.id))
      );
      
      recommendedQuestions = [
        ...recommendedQuestions,
        ...otherNotCompletedQuestions
      ].slice(0, 5);
    }
    
    return recommendedQuestions;
  };
  
  // Get category completion percentages
  const getCategoryCompletions = () => {
    if (!questions || !userProgress) return [];
    
    const categoryTotals: Record<QuestionCategory, number> = {
      constitutional_law: 0,
      contracts: 0,
      criminal_law: 0,
      evidence: 0,
      property: 0,
      torts: 0,
      civil_procedure: 0,
      other: 0
    };
    
    const categoryCompleted: Record<QuestionCategory, number> = {
      constitutional_law: 0,
      contracts: 0,
      criminal_law: 0,
      evidence: 0,
      property: 0,
      torts: 0,
      civil_procedure: 0,
      other: 0
    };
    
    // Count total questions per category
    questions.forEach(q => {
      categoryTotals[q.category]++;
    });
    
    // Count completed questions per category
    questions.forEach(q => {
      const progress = userProgress.find(p => p.question_id === q.id);
      if (progress && progress.status === 'completed') {
        categoryCompleted[q.category]++;
      }
    });
    
    // Calculate percentages and sort by completion
    return Object.entries(categoryTotals)
      .map(([category, total]) => ({
        category: category as QuestionCategory,
        total,
        completed: categoryCompleted[category as QuestionCategory],
        percentage: total > 0 
          ? Math.round((categoryCompleted[category as QuestionCategory] / total) * 100) 
          : 0
      }))
      .sort((a, b) => b.percentage - a.percentage);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16 px-4">
          <div className="max-w-md mx-auto text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-6 text-plato-500" />
            <h1 className="text-3xl font-bold mb-4">Join PLATO to Create Your Study Plan</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Sign in to access your personalized study plan and track your bar exam preparation progress.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link to="/">Sign In</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/">Create Account</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-2">
            <Button variant="ghost" size="sm" asChild className="mr-2">
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Home
              </Link>
            </Button>
          </div>
          
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Your Study Plan</h1>
            <Button asChild>
              <Link to="/questions">
                Practice Questions
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <p>Loading your study plan...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                  <GlassCard className="p-6">
                    <div className="flex items-center mb-4">
                      <BrainCircuit className="w-5 h-5 mr-2 text-plato-600" />
                      <h2 className="text-xl font-bold">Recommended Practice</h2>
                    </div>
                    
                    {getRecommendedQuestions().length > 0 ? (
                      <div className="divide-y">
                        {getRecommendedQuestions().map(question => (
                          <div key={question.id} className="py-4 first:pt-0 last:pb-0">
                            <div className="flex justify-between gap-4">
                              <div>
                                <h3 className="font-medium text-lg mb-2">{question.title}</h3>
                                <div className="flex flex-wrap gap-2 mb-2">
                                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                    question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                                    question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                                  </span>
                                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                                    {categoryLabels[question.category]}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {question.description.replace(/<[^>]*>/g, '').substring(0, 100)}...
                                </p>
                              </div>
                              <Button variant="outline" size="sm" className="shrink-0 self-start" asChild>
                                <Link to={`/questions/${question.id}`}>
                                  Practice
                                </Link>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
                        <h3 className="text-lg font-medium">All caught up!</h3>
                        <p className="text-muted-foreground mt-2">
                          You've completed all questions. Great job!
                        </p>
                        <Button className="mt-4" asChild>
                          <Link to="/questions">Review All Questions</Link>
                        </Button>
                      </div>
                    )}
                  </GlassCard>
                </div>
                
                <GlassCard className="p-6">
                  <div className="flex items-center mb-4">
                    <BarChart3 className="w-5 h-5 mr-2 text-plato-600" />
                    <h2 className="text-xl font-bold">Your Stats</h2>
                  </div>
                  
                  {studyStats && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-background/50 p-3 rounded-md">
                          <div className="text-2xl font-bold">{studyStats.average_score}%</div>
                          <div className="text-xs text-muted-foreground">Avg. Score</div>
                        </div>
                        <div className="bg-background/50 p-3 rounded-md">
                          <div className="text-2xl font-bold flex items-end">
                            {studyStats.streak_days}
                            <span className="text-amber-500 ml-1">
                              <Flame className="h-6 w-6" />
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">Day Streak</div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Focus Areas</h3>
                        {studyStats.weaknesses.length > 0 ? (
                          <div className="space-y-2">
                            {studyStats.weaknesses.map(category => (
                              <div key={category} className="text-sm flex items-center">
                                <span className="w-full">{categoryLabels[category]}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No specific focus areas identified yet
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Strengths</h3>
                        {studyStats.strengths.length > 0 ? (
                          <div className="space-y-2">
                            {studyStats.strengths.map(category => (
                              <div key={category} className="text-sm flex items-center">
                                <span className="w-full">{categoryLabels[category]}</span>
                                <Trophy className="h-4 w-4 text-amber-500" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Keep practicing to identify your strengths
                          </p>
                        )}
                      </div>
                      
                      <div className="pt-2">
                        <Button variant="outline" className="w-full" asChild>
                          <Link to="/dashboard">Full Dashboard</Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </GlassCard>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                  <GlassCard className="p-6">
                    <Tabs defaultValue="progress">
                      <TabsList className="mb-4">
                        <TabsTrigger value="progress">Category Progress</TabsTrigger>
                        <TabsTrigger value="calendar">Study Calendar</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="progress">
                        <div className="space-y-6">
                          <h2 className="text-xl font-bold flex items-center">
                            <BarChart3 className="w-5 h-5 mr-2 text-plato-600" />
                            Subject Progress
                          </h2>
                          
                          <div className="space-y-4">
                            {getCategoryCompletions().map(category => (
                              <div key={category.category}>
                                <div className="flex justify-between mb-2">
                                  <span className="text-sm font-medium">
                                    {categoryLabels[category.category]}
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    {category.completed}/{category.total} questions
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Progress value={category.percentage} className="h-2 w-full" />
                                  <span className="text-sm font-medium w-12 text-right">
                                    {category.percentage}%
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="calendar">
                        <div className="space-y-6">
                          <h2 className="text-xl font-bold flex items-center">
                            <CalendarDays className="w-5 h-5 mr-2 text-plato-600" />
                            Study Calendar
                          </h2>
                          
                          <div className="flex justify-center">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              className="rounded-md border"
                            />
                          </div>
                          
                          <div className="bg-background/50 p-4 rounded-md">
                            <h3 className="font-medium mb-2">
                              {selectedDate?.toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </h3>
                            
                            <div className="text-sm text-muted-foreground">
                              <p>Recommended study focus: {
                                studyStats?.weaknesses[0] 
                                  ? categoryLabels[studyStats.weaknesses[0]] 
                                  : "Mixed subjects"
                              }</p>
                              <p className="mt-1">Target: 10 questions</p>
                            </div>
                            
                            <Button className="mt-4 w-full" asChild>
                              <Link to="/questions">Start Studying</Link>
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </GlassCard>
                </div>
                
                <GlassCard className="p-6">
                  <div className="flex items-center mb-4">
                    <Clock className="w-5 h-5 mr-2 text-plato-600" />
                    <h2 className="text-xl font-bold">Study Timer</h2>
                  </div>
                  
                  <div className="text-center py-4">
                    <div className="text-5xl font-bold mb-6">25:00</div>
                    
                    <div className="flex justify-center gap-4 mb-6">
                      <Button>Start</Button>
                      <Button variant="outline">Reset</Button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="ghost" size="sm">15m</Button>
                      <Button variant="ghost" size="sm">25m</Button>
                      <Button variant="ghost" size="sm">45m</Button>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-6">
                      Use the Pomodoro technique to stay focused and productive
                    </p>
                  </div>
                </GlassCard>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StudyPlan;
