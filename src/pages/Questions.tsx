
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { questionService } from '@/lib/supabase';
import { QuestionCategory, QuestionDifficulty } from '@/types/question';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlassCard from '@/components/ui-custom/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Filter, BookOpen, Search } from 'lucide-react';

const difficultyColors = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800'
};

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

const Questions = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | 'all'>('all');
  
  const { data: questions, isLoading } = useQuery({
    queryKey: ['questions'],
    queryFn: questionService.getQuestions,
  });

  const { data: userProgress, isLoading: isProgressLoading } = useQuery({
    queryKey: ['userProgress', user?.id],
    queryFn: () => user?.id ? questionService.getUserProgress(user.id) : Promise.resolve([]),
    enabled: !!user?.id,
  });

  const getQuestionStatus = (questionId: string) => {
    if (!userProgress) return 'not_attempted';
    const progress = userProgress.find(p => p.question_id === questionId);
    return progress?.status || 'not_attempted';
  };

  const filteredQuestions = questions?.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || question.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories: (QuestionCategory | 'all')[] = [
    'all', 
    'constitutional_law', 
    'contracts', 
    'criminal_law', 
    'evidence', 
    'property', 
    'torts', 
    'civil_procedure', 
    'other'
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Practice Questions</h1>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-[250px]"
              />
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={18} className="text-muted-foreground" />
              <span className="text-sm font-medium">Filter by category:</span>
            </div>
            
            <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:flex lg:flex-wrap gap-2">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category}
                  value={category}
                  onClick={() => setSelectedCategory(category)}
                  className="text-xs md:text-sm"
                >
                  {category === 'all' ? 'All Categories' : categoryLabels[category as QuestionCategory]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <p>Loading questions...</p>
            </div>
          ) : (
            <>
              {filteredQuestions?.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No questions found</h3>
                  <p className="text-muted-foreground mt-2">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredQuestions?.map((question) => {
                    const status = getQuestionStatus(question.id);
                    
                    return (
                      <Link to={`/questions/${question.id}`} key={question.id}>
                        <GlassCard 
                          className="hover:shadow-md transition-all duration-200"
                          hoverEffect
                        >
                          <div className="flex justify-between gap-4">
                            <div>
                              <h3 className="font-medium text-lg mb-2">{question.title}</h3>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className={difficultyColors[question.difficulty]}>
                                  {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                                </Badge>
                                <Badge variant="outline">
                                  {categoryLabels[question.category]}
                                </Badge>
                                {status === 'completed' && (
                                  <Badge className="bg-green-500">Completed</Badge>
                                )}
                                {status === 'in_progress' && (
                                  <Badge className="bg-yellow-500">In Progress</Badge>
                                )}
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              Practice
                            </Button>
                          </div>
                        </GlassCard>
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Questions;
