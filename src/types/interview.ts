import type { SupportedLanguage } from './index';

// --- Question Types ---

export type QuestionType = 'text' | 'single_choice' | 'multi_choice' | 'slider' | 'rating';

export interface QuestionOption {
  id: string;
  label: string;
  value: string;
  icon?: string;
}

export interface InterviewQuestion {
  id: string;
  text: string;
  type: QuestionType;
  category: 'background' | 'goals' | 'skills' | 'preferences' | 'availability';
  options?: QuestionOption[];
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  required: boolean;
  followUpRules?: FollowUpRule[];
}

export interface FollowUpRule {
  condition: {
    questionId: string;
    operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan';
    value: string | number;
  };
  nextQuestionId: string;
}

// --- Interview Session ---

export interface InterviewResponse {
  questionId: string;
  answer: string | string[] | number;
  answeredAt: string;
}

export type InterviewStatus = 'not_started' | 'in_progress' | 'completed' | 'abandoned';

export interface InterviewSession {
  id: string;
  userId?: string;
  status: InterviewStatus;
  language: SupportedLanguage;
  mode: 'typeform' | 'voice';
  responses: InterviewResponse[];
  currentQuestionIndex: number;
  startedAt: string;
  completedAt?: string;
  generatedProfile?: InterviewProfile;
}

// --- Generated Profile (output of interview) ---

export interface InterviewProfile {
  name: string;
  language: SupportedLanguage;
  currentRole: string;
  experienceLevel: 'none' | 'beginner' | 'intermediate' | 'advanced';
  programmingLanguages: string[];
  aiExperience: string[];
  goals: string[];
  specificInterests: string[];
  availableHoursPerWeek: number;
  learningStyle: 'visual' | 'reading' | 'hands_on' | 'mixed';
  deadline?: string;
  education: string;
  preferredProjectTypes: string[];
}

// --- Adaptive Question Flow ---

export interface AdaptiveQuestionFlow {
  baseQuestions: InterviewQuestion[];
  adaptiveQuestions: Map<string, InterviewQuestion[]>;
  getNextQuestion: (responses: InterviewResponse[]) => InterviewQuestion | null;
}

// --- Voice Interview ---

export interface VoiceInterviewConfig {
  language: SupportedLanguage;
  apiKey?: string;
  model?: string;
}

export interface VoiceTranscript {
  text: string;
  confidence: number;
  language: SupportedLanguage;
  timestamp: string;
}

// --- Question Bank (Vertex Datastore) ---

export interface StoredQuestion {
  id: string;
  text: string;
  type: QuestionType;
  category: InterviewQuestion['category'];
  options?: QuestionOption[];
  usageCount: number;
  effectivenessScore: number;
  createdAt: string;
  updatedAt: string;
  source: 'seed' | 'crawled' | 'user_generated';
  language: SupportedLanguage;
  tags: string[];
}
