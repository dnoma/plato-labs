
import { createClient } from '@supabase/supabase-js';
import type { Question, UserQuestionProgress } from '@/types/question';

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
  }
};

export default supabase;
