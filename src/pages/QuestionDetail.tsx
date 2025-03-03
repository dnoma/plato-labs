
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { questionService } from '@/lib/supabase';
import { QuestionOption, UserQuestionProgress } from '@/types/question';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlassCard from '@/components/ui-custom/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Check, 
  X, 
  AlertCircle, 
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  BookOpen
} from 'lucide-react';

const QuestionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  // Fetch question
  const { data: question, isLoading } = useQuery({
    queryKey: ['question', id],
    queryFn: () => id ? questionService.getQuestionById(id) : Promise.resolve(null),
    enabled: !!id,
  });

  // Fetch user progress for this question
  const { data: progressData } = useQuery({
    queryKey: ['questionProgress', user?.id, id],
    queryFn: async () => {
      if (!user?.id || !id) return null;
      const allProgress = await questionService.getUserProgress(user.id);
      return allProgress.find(p => p.question_id === id) || null;
    },
    enabled: !!user?.id && !!id,
  });

  // Initialize user progress if needed
  const initProgress = useMutation({
    mutationFn: (progress: Partial<UserQuestionProgress>) => 
      questionService.updateUserProgress(progress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questionProgress', user?.id, id] });
    },
  });

  // Submit answer
  const submitAnswer = useMutation({
    mutationFn: (progress: Partial<UserQuestionProgress>) => 
      questionService.updateUserProgress(progress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questionProgress', user?.id, id] });
      queryClient.invalidateQueries({ queryKey: ['userProgress', user?.id] });
      
      const isCorrect = question?.options.find(o => o.id === selectedOptionId)?.isCorrect;
      
      if (isCorrect) {
        toast({
          title: "Correct!",
          description: "Great job! You've answered correctly.",
          variant: "default",
        });
      } else {
        toast({
          title: "Incorrect",
          description: "Review the explanation to understand the correct answer.",
          variant: "destructive",
        });
      }
      
      setHasSubmitted(true);
    },
  });

  const handleSelectOption = (optionId: string) => {
    if (hasSubmitted) return;
    setSelectedOptionId(optionId);
    
    // Initialize progress if this is first interaction
    if (!progressData && user) {
      initProgress.mutate({
        user_id: user.id,
        question_id: id!,
        status: 'in_progress',
        attempts: 0,
        last_attempted_at: new Date().toISOString(),
      });
    }
  };

  const handleSubmit = () => {
    if (!user || !id || !selectedOptionId) return;
    
    const isCorrect = question?.options.find(o => o.id === selectedOptionId)?.isCorrect;
    const newStatus = isCorrect ? 'completed' : 'in_progress';
    
    submitAnswer.mutate({
      user_id: user.id,
      question_id: id,
      status: newStatus,
      selected_option_id: selectedOptionId,
      attempts: (progressData?.attempts || 0) + 1,
      last_attempted_at: new Date().toISOString(),
    });
  };

  const handleReset = () => {
    setSelectedOptionId('');
    setHasSubmitted(false);
  };

  // Get the correct option after submission
  const getCorrectOption = () => {
    return question?.options.find(option => option.isCorrect);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="max-w-3xl mx-auto">
            <p className="text-center">Loading question...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="max-w-3xl mx-auto text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Question Not Found</h2>
            <p className="mb-6">The question you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/questions">Back to Questions</Link>
            </Button>
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
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              asChild 
              className="mb-4"
            >
              <Link to="/questions">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Questions
              </Link>
            </Button>
            
            <div className="flex justify-between items-center">
              <h1 className="text-2xl md:text-3xl font-bold">{question.title}</h1>
              
              <div className="flex gap-2">
                <Badge variant="outline" className={
                  question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }>
                  {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                </Badge>
                
                {progressData?.attempts && (
                  <Badge variant="outline">
                    {progressData.attempts} {progressData.attempts === 1 ? 'attempt' : 'attempts'}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <GlassCard className="mb-8">
            <div 
              className="prose max-w-none mb-6"
              dangerouslySetInnerHTML={{ __html: question.description }}
            />
            
            <RadioGroup value={selectedOptionId} className="space-y-4">
              {question.options.map((option) => {
                const isCorrect = option.isCorrect;
                const isSelected = selectedOptionId === option.id;
                let optionClass = "border p-4 rounded-md";
                
                if (hasSubmitted) {
                  if (isCorrect) {
                    optionClass += " border-green-500 bg-green-50";
                  } else if (isSelected && !isCorrect) {
                    optionClass += " border-red-500 bg-red-50";
                  }
                } else if (isSelected) {
                  optionClass += " border-plato-500 bg-plato-50";
                }

                return (
                  <div 
                    key={option.id} 
                    className={optionClass}
                    onClick={() => handleSelectOption(option.id)}
                  >
                    <div className="flex items-start gap-3">
                      <RadioGroupItem 
                        value={option.id} 
                        id={option.id}
                        disabled={hasSubmitted}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label 
                          htmlFor={option.id} 
                          className="text-base font-normal cursor-pointer"
                        >
                          {option.text}
                        </Label>
                        
                        {hasSubmitted && isCorrect && (
                          <div className="flex items-center gap-2 mt-2 text-green-600">
                            <Check className="w-5 h-5" /> 
                            <span className="text-sm">Correct answer</span>
                          </div>
                        )}
                        
                        {hasSubmitted && isSelected && !isCorrect && (
                          <div className="flex items-center gap-2 mt-2 text-red-600">
                            <X className="w-5 h-5" /> 
                            <span className="text-sm">Incorrect answer</span>
                          </div>
                        )}
                        
                        {hasSubmitted && option.explanation && (
                          <div className="mt-2 text-sm text-gray-600 border-l-2 border-gray-300 pl-3">
                            {option.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </RadioGroup>
            
            <div className="mt-6 flex gap-4">
              {!hasSubmitted ? (
                <Button 
                  onClick={handleSubmit}
                  disabled={!selectedOptionId || submitAnswer.isPending}
                  className="px-6"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button 
                  onClick={handleReset}
                  variant="outline"
                  className="px-6"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              )}
            </div>
          </GlassCard>
          
          {hasSubmitted && (
            <GlassCard>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Explanation
              </h3>
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: question.explanation }}
              />
            </GlassCard>
          )}
          
          <div className="mt-8 flex justify-between">
            <Button variant="outline" size="sm" asChild>
              <Link to="/questions">
                <ChevronLeft className="w-4 h-4 mr-2" />
                All Questions
              </Link>
            </Button>
            
            {/* This would be linked to the next question in a real app */}
            <Button variant="outline" size="sm" asChild>
              <Link to="/questions">
                Next Question
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuestionDetail;
