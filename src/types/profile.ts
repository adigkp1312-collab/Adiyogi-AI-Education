import type { SupportedLanguage } from './index';

// --- Signal Types (any user interaction that updates the profile) ---

export type SignalType =
  | 'module_completed'
  | 'quiz_score'
  | 'time_spent'
  | 'check_in'
  | 'content_preference'
  | 'resource_skipped'
  | 'course_started'
  | 'course_completed'
  | 'goal_updated';

export interface ProfileSignal {
  id: string;
  userId: string;
  type: SignalType;
  payload: Record<string, unknown>;
  timestamp: string;
  courseId?: string;
  moduleNumber?: number;
}

// --- Skill Snapshot (evolves with signals) ---

export interface SkillSnapshot {
  experienceLevel: 'none' | 'beginner' | 'intermediate' | 'advanced';
  programmingLanguages: string[];
  aiExperience: string[];
  strongAreas: string[];
  weakAreas: string[];
  lastAssessedAt: string;
}

// --- Learning Preferences (evolves with signals) ---

export interface LearningPreferences {
  learningStyle: 'visual' | 'reading' | 'hands_on' | 'mixed';
  availableHoursPerWeek: number;
  deadline?: string;
  preferredPace: 'slow' | 'normal' | 'fast';
  preferredDifficulty: 'easy' | 'moderate' | 'hard';
  contentTypeAffinity: Record<string, number>; // e.g. { video: 0.8, article: 0.3 }
}

// --- Behavioral Profile (computed from signals) ---

export interface BehavioralProfile {
  totalTimeSpentMinutes: number;
  averageSessionMinutes: number;
  completionRate: number;
  averageQuizScore: number;
  currentStreak: number;
  engagementTrend: 'rising' | 'stable' | 'declining';
  lastActiveAt: string;
  coursesCompleted: number;
  coursesInProgress: number;
}

// --- Enriched Profile (single source of truth) ---

export interface EnrichedProfile {
  // Identity (from interview, mostly immutable)
  userId: string;
  name: string;
  language: SupportedLanguage;
  education: string;
  currentRole: string;
  createdAt: string;
  updatedAt: string;

  // Skills (evolves)
  skills: SkillSnapshot;

  // Learning preferences (evolves)
  preferences: LearningPreferences;

  // Goals & interests (evolves)
  goals: string[];
  specificInterests: string[];
  preferredProjectTypes: string[];

  // Behavioral (computed from signal log)
  behavioral: BehavioralProfile;

  // Active courses
  activeCourseIds: string[];

  // Natural language summary (for Vertex AI Search)
  profileSummary: string;
  lastSyncedToVertexAt: string;

  // Optimistic concurrency
  version: number;
}

// --- Vertex AI Datastore document shape ---

export interface ProfileDocument {
  id: string;
  content: string;
  userId: string;
  level: string;
  goals: string[];
  interests: string[];
  weakAreas: string[];
  strongAreas: string[];
}
