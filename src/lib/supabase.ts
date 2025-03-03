
import { createClient } from '@supabase/supabase-js';
import type { Question, UserQuestionProgress, UserStudyStats, QuestionCategory } from '@/types/question';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Questions API
export const questionService = {
  async getQuestions() {
    const { data, error } = await supabase
      .from('questions')
      .select('*');
    
    if (error) throw error;
    return data as Question[];
  },

  async getQuestionById(id: string) {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Question;
  },

  async getQuestionsByCategory(category: QuestionCategory) {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('category', category);
    
    if (error) throw error;
    return data as Question[];
  },

  async getUserProgress(userId: string) {
    const { data, error } = await supabase
      .from('user_question_progress')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data as UserQuestionProgress[];
  },

  async updateUserProgress(progress: Partial<UserQuestionProgress>) {
    const { data, error } = await supabase
      .from('user_question_progress')
      .upsert(progress)
      .select()
      .single();
    
    if (error) throw error;
    return data as UserQuestionProgress;
  },
  
  async toggleBookmark(userId: string, questionId: string, isBookmarked: boolean) {
    const { data, error } = await supabase
      .from('user_question_progress')
      .upsert({
        user_id: userId,
        question_id: questionId,
        is_bookmarked: isBookmarked,
        status: 'not_attempted', // Default status if this is a new record
        attempts: 0, // Default attempts if this is a new record
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as UserQuestionProgress;
  },
  
  async saveUserNotes(userId: string, questionId: string, notes: string) {
    const { data, error } = await supabase
      .from('user_question_progress')
      .upsert({
        user_id: userId,
        question_id: questionId,
        notes,
        status: 'not_attempted', // Default status if this is a new record
        attempts: 0, // Default attempts if this is a new record
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as UserQuestionProgress;
  },
  
  async getUserStudyStats(userId: string) {
    // This would be a more complex query in a real application
    // For now, we'll calculate it based on the user's progress
    
    const { data: progress, error } = await supabase
      .from('user_question_progress')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    const userProgress = progress as UserQuestionProgress[];
    
    // Get all questions to calculate category-based performance
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*');
    
    if (questionsError) throw questionsError;
    
    const allQuestions = questions as Question[];
    
    // Calculate strength and weakness categories
    const categorySuccess: Record<QuestionCategory, { correct: number, total: number }> = {
      constitutional_law: { correct: 0, total: 0 },
      contracts: { correct: 0, total: 0 },
      criminal_law: { correct: 0, total: 0 },
      evidence: { correct: 0, total: 0 },
      property: { correct: 0, total: 0 },
      torts: { correct: 0, total: 0 },
      civil_procedure: { correct: 0, total: 0 },
      other: { correct: 0, total: 0 }
    };
    
    // Process each progress entry
    userProgress.forEach(prog => {
      const question = allQuestions.find(q => q.id === prog.question_id);
      if (question && prog.status === 'completed') {
        categorySuccess[question.category].total++;
        
        const correctOption = question.options.find(opt => opt.isCorrect);
        if (correctOption && prog.selected_option_id === correctOption.id) {
          categorySuccess[question.category].correct++;
        }
      }
    });
    
    // Determine strengths and weaknesses
    const strengths: QuestionCategory[] = [];
    const weaknesses: QuestionCategory[] = [];
    
    Object.entries(categorySuccess).forEach(([category, stats]) => {
      if (stats.total > 0) {
        const successRate = stats.correct / stats.total;
        if (successRate >= 0.7) {
          strengths.push(category as QuestionCategory);
        } else if (successRate < 0.5) {
          weaknesses.push(category as QuestionCategory);
        }
      }
    });
    
    // Calculate other stats
    const totalCompleted = userProgress.filter(p => p.status === 'completed').length;
    const totalAttempted = userProgress.filter(p => p.status === 'completed' || p.status === 'in_progress').length;
    const totalCorrect = userProgress.filter(p => {
      if (p.status !== 'completed') return false;
      const question = allQuestions.find(q => q.id === p.question_id);
      if (!question) return false;
      const correctOption = question.options.find(opt => opt.isCorrect);
      return correctOption?.id === p.selected_option_id;
    }).length;
    
    const averageScore = totalAttempted > 0 ? (totalCorrect / totalAttempted) * 100 : 0;
    
    // Calculate streak (in a real app, this would be more sophisticated)
    const lastStudyDate = userProgress.length > 0 
      ? userProgress.reduce((latest, curr) => {
          const currDate = curr.last_attempted_at ? new Date(curr.last_attempted_at) : new Date(0);
          return currDate > latest ? currDate : latest;
        }, new Date(0)).toISOString()
      : '';
    
    // In a real app, you would have a more sophisticated streak calculation
    const streakDays = 1; 
    
    // Calculate total time spent (if time_spent field is populated)
    const totalTimeSpent = userProgress.reduce((total, curr) => total + (curr.time_spent || 0), 0);
    
    return {
      total_questions_attempted: totalAttempted,
      total_questions_completed: totalCompleted,
      total_time_spent: totalTimeSpent,
      average_score: Math.round(averageScore),
      strengths,
      weaknesses,
      streak_days: streakDays,
      last_study_date: lastStudyDate
    } as UserStudyStats;
  }
};

export default supabase;
