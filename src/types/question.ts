
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';
export type QuestionStatus = 'not_attempted' | 'in_progress' | 'completed';
export type QuestionCategory = 'constitutional_law' | 'contracts' | 'criminal_law' | 'evidence' | 'property' | 'torts' | 'civil_procedure' | 'other';

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  category: QuestionCategory;
  difficulty: QuestionDifficulty;
  options: QuestionOption[];
  explanation: string;
  created_at: string;
  tags?: string[]; // Optional tags for better organization
  source?: string; // Optional source of the question (e.g., MPRE, MBE)
  time_estimate?: number; // Estimated time to complete in minutes
}

export interface UserQuestionProgress {
  user_id: string;
  question_id: string;
  status: QuestionStatus;
  selected_option_id?: string;
  attempts: number;
  last_attempted_at?: string;
  time_spent?: number; // Time spent on the question in seconds
  notes?: string; // User's notes on the question
  is_bookmarked?: boolean; // Whether the user has bookmarked the question
}

export interface UserStudyStats {
  total_questions_attempted: number;
  total_questions_completed: number;
  total_time_spent: number; // Time spent studying in seconds
  average_score: number; // Percentage of correct answers
  strengths: QuestionCategory[]; // Categories with high success rate
  weaknesses: QuestionCategory[]; // Categories with low success rate
  streak_days: number; // Number of consecutive days studied
  last_study_date: string;
}
