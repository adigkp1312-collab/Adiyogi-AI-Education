import type { InterviewProfile } from '../../types/interview';

/**
 * Payload 1: Beginner profile — Priya Sharma
 */
export const BEGINNER_PROFILE: InterviewProfile = {
  name: 'Priya Sharma',
  language: 'hi',
  currentRole: 'Computer Science Student',
  experienceLevel: 'beginner',
  programmingLanguages: ['python'],
  aiExperience: [],
  goals: ['Get a job in AI', 'Build AI-powered apps'],
  specificInterests: ['llm', 'agents', 'rag'],
  availableHoursPerWeek: 8,
  learningStyle: 'hands_on',
  deadline: '2026-09-01',
  education: 'B.Tech CS 3rd year',
  preferredProjectTypes: ['chatbot', 'web app'],
};

/**
 * Payload 2: Advanced profile — Rahul Verma
 */
export const ADVANCED_PROFILE: InterviewProfile = {
  name: 'Rahul Verma',
  language: 'en',
  currentRole: 'Senior ML Engineer',
  experienceLevel: 'advanced',
  programmingLanguages: ['python', 'javascript', 'rust'],
  aiExperience: ['trained models', 'deployed to production', 'fine-tuning'],
  goals: ['Build production AI agents'],
  specificInterests: ['agents', 'rag', 'mlops'],
  availableHoursPerWeek: 15,
  learningStyle: 'reading',
  education: 'M.Tech AI from IIT Delhi',
  preferredProjectTypes: ['agent', 'pipeline'],
};

/**
 * Edge case: experienceLevel "none"
 */
export const NONE_EXPERIENCE_PROFILE: InterviewProfile = {
  name: 'Ananya Patel',
  language: 'en',
  currentRole: 'Marketing Manager',
  experienceLevel: 'none',
  programmingLanguages: [],
  aiExperience: [],
  goals: ['Understand AI basics'],
  specificInterests: ['llm'],
  availableHoursPerWeek: 5,
  learningStyle: 'visual',
  education: 'MBA',
  preferredProjectTypes: [],
};

/**
 * Edge case: zero available hours
 */
export const ZERO_HOURS_PROFILE: InterviewProfile = {
  name: 'Zero Hours User',
  language: 'en',
  currentRole: 'Student',
  experienceLevel: 'beginner',
  programmingLanguages: ['python'],
  aiExperience: [],
  goals: ['Learn AI'],
  specificInterests: ['agents'],
  availableHoursPerWeek: 0,
  learningStyle: 'mixed',
  education: 'B.Sc',
  preferredProjectTypes: [],
};

/**
 * Edge case: all interests selected
 */
export const ALL_INTERESTS_PROFILE: InterviewProfile = {
  name: 'All Interests User',
  language: 'en',
  currentRole: 'Developer',
  experienceLevel: 'intermediate',
  programmingLanguages: ['python', 'javascript'],
  aiExperience: ['basic ML'],
  goals: ['Master everything'],
  specificInterests: [
    'llm',
    'agents',
    'rag',
    'fine_tuning',
    'mlops',
    'multimodal',
    'voice',
    'full_stack_ai',
  ],
  availableHoursPerWeek: 20,
  learningStyle: 'hands_on',
  education: 'B.Tech',
  preferredProjectTypes: ['web app'],
};

/**
 * Multilingual profiles
 */
export const HINDI_PROFILE: InterviewProfile = {
  ...BEGINNER_PROFILE,
  name: 'Hindi User',
  language: 'hi',
};

export const TAMIL_PROFILE: InterviewProfile = {
  ...BEGINNER_PROFILE,
  name: 'Tamil User',
  language: 'ta',
};

export const TELUGU_PROFILE: InterviewProfile = {
  ...BEGINNER_PROFILE,
  name: 'Telugu User',
  language: 'te',
};
