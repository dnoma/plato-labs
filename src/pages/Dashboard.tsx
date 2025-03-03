
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { questionService } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlassCard from '@/components/ui-custom/GlassCard';
import AnimatedNumber from '@/components/ui-custom/AnimatedNumber';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts';
import { 
  BookOpen, 
  Award, 
  Clock,
  BarChart2,
  PieChart as PieChartIcon,
  ArrowUpRight, 
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  // Get questions
  const { data: questions, isLoading: isQuestionsLoading } = useQuery({
    queryKey: ['questions'],
    queryFn: questionService.getQuestions,
  });

  // Get user progress
  const { data: userProgress, isLoading: isProgressLoading } = useQuery({
    queryKey: ['userProgress', user?.id],
    queryFn: () => user?.id ? questionService.getUserProgress(user.id) : Promise.resolve([]),
    enabled: !!user?.id,
  });

  // Calculate stats
  const getTotalQuestions = () => questions?.length || 0;
  
  const getCompletedQuestions = () => {
    if (!userProgress || !questions) return 0;
    return userProgress.filter(p => p.status === 'completed').length;
  };
  
  const getInProgressQuestions = () => {
    if (!userProgress || !questions) return 0;
    return userProgress.filter(p => p.status === 'in_progress').length;
  };
  
  const getRemainingQuestions = () => {
    if (!userProgress || !questions) return getTotalQuestions();
    return getTotalQuestions() - getCompletedQuestions() - getInProgressQuestions();
  };
  
  const getCompletionPercentage = () => {
    if (!questions || !questions.length) return 0;
    return Math.round((getCompletedQuestions() / getTotalQuestions()) * 100);
  };

  // Prepare chart data
  const categoryData = React.useMemo(() => {
    if (!questions) return [];
    
    const categoryCounts: Record<string, number> = {};
    questions.forEach(q => {
      categoryCounts[q.category] = (categoryCounts[q.category] || 0) + 1;
    });
    
    return Object.entries(categoryCounts).map(([category, count]) => ({
      name: category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      count,
    }));
  }, [questions]);
  
  const progressData = React.useMemo(() => {
    return [
      { name: 'Completed', value: getCompletedQuestions(), color: '#16a34a' },
      { name: 'In Progress', value: getInProgressQuestions(), color: '#eab308' },
      { name: 'Not Started', value: getRemainingQuestions(), color: '#94a3b8' },
    ];
  }, [userProgress, questions]);

  const difficultyData = React.useMemo(() => {
    if (!questions) return [];
    
    const difficultyCounts: Record<string, number> = {
      easy: 0,
      medium: 0,
      hard: 0,
    };
    
    questions.forEach(q => {
      difficultyCounts[q.difficulty] = (difficultyCounts[q.difficulty] || 0) + 1;
    });
    
    return [
      { name: 'Easy', count: difficultyCounts.easy, color: '#22c55e' },
      { name: 'Medium', count: difficultyCounts.medium, color: '#f59e0b' },
      { name: 'Hard', count: difficultyCounts.hard, color: '#ef4444' },
    ];
  }, [questions]);

  const isLoading = isQuestionsLoading || isProgressLoading;

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16 px-4">
          <div className="max-w-md mx-auto text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-6 text-plato-500" />
            <h1 className="text-3xl font-bold mb-4">Join PLATO to Track Your Progress</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Sign in to access your personalized dashboard and track your bar exam preparation progress.
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
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Your Dashboard</h1>
            <Button asChild>
              <Link to="/questions">
                Practice Questions
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <p>Loading dashboard...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <GlassCard className="flex items-center">
                  <div className="mr-4 bg-plato-100 p-3 rounded-full">
                    <Award className="h-8 w-8 text-plato-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                    <h3 className="text-2xl font-bold">
                      <AnimatedNumber 
                        value={getCompletionPercentage()} 
                        suffix="%" 
                      />
                    </h3>
                  </div>
                </GlassCard>
                
                <GlassCard className="flex items-center">
                  <div className="mr-4 bg-green-100 p-3 rounded-full">
                    <BookOpen className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Questions Completed</p>
                    <h3 className="text-2xl font-bold">
                      <AnimatedNumber 
                        value={getCompletedQuestions()} 
                        suffix={` / ${getTotalQuestions()}`} 
                      />
                    </h3>
                  </div>
                </GlassCard>
                
                <GlassCard className="flex items-center">
                  <div className="mr-4 bg-yellow-100 p-3 rounded-full">
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                    <h3 className="text-2xl font-bold">
                      <AnimatedNumber 
                        value={getInProgressQuestions()} 
                      />
                    </h3>
                  </div>
                </GlassCard>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <GlassCard className="p-4">
                  <div className="flex items-center mb-4">
                    <BarChart2 className="h-5 w-5 mr-2 text-plato-600" />
                    <h3 className="text-lg font-bold">Questions by Category</h3>
                  </div>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={categoryData}
                        margin={{ top: 5, right: 5, left: 5, bottom: 25 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          angle={-45} 
                          textAnchor="end" 
                          height={70}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3b82f6">
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`hsl(210, ${70 + index * 3}%, ${50 - index * 3}%)`} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </GlassCard>
                
                <GlassCard className="p-4">
                  <div className="flex items-center mb-4">
                    <PieChartIcon className="h-5 w-5 mr-2 text-plato-600" />
                    <h3 className="text-lg font-bold">Your Progress</h3>
                  </div>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={progressData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          fill="#8884d8"
                          paddingAngle={3}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {progressData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </GlassCard>
              </div>
              
              <GlassCard className="p-4 mb-8">
                <div className="flex items-center mb-4">
                  <h3 className="text-lg font-bold">Questions by Difficulty</h3>
                </div>
                <div className="h-16">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={difficultyData}
                      layout="vertical"
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                        width={80}
                      />
                      <Tooltip />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {difficultyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
              
              <div className="text-center">
                <Button asChild className="px-8">
                  <Link to="/questions">Continue Practicing</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
