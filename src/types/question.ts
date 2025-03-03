
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
}

export interface UserQuestionProgress {
  user_id: string;
  question_id: string;
  status: QuestionStatus;
  selected_option_id?: string;
  attempts: number;
  last_attempted_at?: string;
}
