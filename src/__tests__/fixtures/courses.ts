import type { CourseJSON, CurriculumModule, LearnerProfile, IndexedCourse } from '../../types';
import type { EvaluationData, ModuleEvaluation } from '../../services/evaluationEngine';

/**
 * A minimal course with 3 modules for testing evaluation/adaptation.
 */
export const MOCK_COURSE: CourseJSON = {
  id: 'course-456',
  created_at: 1741000000000,
  updated_at: 1741000000000,
  status: 'in_progress',
  title: 'Personalized AI Learning Path for Test User',
  description: 'A personalized AI learning path...',
  estimated_duration: '15 weeks',
  skill_level: 'beginner',
  thumbnail: '',
  learner: {
    name: 'Test User',
    goal: 'Learn AI',
    prior_knowledge: ['python'],
    weak_areas: [],
    available_hours_per_week: 8,
    preferred_language: 'en',
    level: 'beginner',
    learning_style: 'mixed',
    deadline: 'flexible',
    education_background: 'B.Tech',
  },
  modules: [
    {
      module_number: 1,
      title: 'Python Fundamentals',
      objective: 'Master python fundamentals',
      duration: '2 weeks',
      topics: ['python basics'],
      courses: [],
      practice: [
        'Complete exercises from course materials',
        'Write notes summarizing key concepts',
      ],
      assessment: 'Quiz on key concepts + submit summary notes',
      prerequisites: [],
    },
    {
      module_number: 2,
      title: 'Intro to AI',
      objective: 'Master intro to AI',
      duration: '2 weeks',
      topics: ['AI basics'],
      courses: [],
      practice: [
        'Complete exercises from course materials',
        'Write notes summarizing key concepts',
      ],
      assessment: 'Quiz on key concepts + submit summary notes',
      prerequisites: ['Module 1'],
    },
    {
      module_number: 3,
      title: 'LLMs & Prompt Engineering',
      objective: 'Master LLMs',
      duration: '2 weeks',
      topics: ['LLMs'],
      courses: [],
      practice: ['Complete exercises from course materials'],
      assessment: 'Quiz on key concepts + submit summary notes',
      prerequisites: ['Module 2'],
    },
  ],
  matched_courses: [],
  tips: [],
  adaptive_notes: '',
  completed_modules: [],
};

/**
 * Payload 4: Evaluation data with module 1 completed, module 2 in progress
 */
export const EVALUATION_WITH_PROGRESS: EvaluationData = {
  userId: 'user-123',
  courseId: 'course-456',
  moduleEvaluations: [
    {
      moduleNumber: 1,
      status: 'completed',
      startedAt: '2026-03-01T00:00:00Z',
      completedAt: '2026-03-10T00:00:00Z',
      timeSpentMinutes: 480,
      quizScore: 85,
      projectSubmitted: false,
      selfRatedConfidence: 4,
      engagementScore: 80,
    },
    {
      moduleNumber: 2,
      status: 'in_progress',
      startedAt: '2026-03-11T00:00:00Z',
      timeSpentMinutes: 120,
      projectSubmitted: false,
      selfRatedConfidence: 2,
      engagementScore: 60,
    },
    {
      moduleNumber: 3,
      status: 'not_started',
      timeSpentMinutes: 0,
      projectSubmitted: false,
      selfRatedConfidence: 0,
      engagementScore: 0,
    },
  ],
  overallProgress: {
    completedModules: 1,
    totalModules: 3,
    completionRate: 33,
    averageQuizScore: 85,
    averageConfidence: 4,
    totalTimeSpentMinutes: 600,
    currentStreak: 5,
    longestStreak: 5,
    lastActiveAt: '2026-03-15T00:00:00Z',
    paceStatus: 'on_track',
  },
  checkIns: [],
  adaptationHistory: [],
  lastEvaluatedAt: '2026-03-15T00:00:00Z',
};

/**
 * Payload 6: Struggling user evaluation (low quiz scores)
 */
export const STRUGGLING_EVALUATION: EvaluationData = {
  userId: 'user-123',
  courseId: 'course-456',
  moduleEvaluations: [
    {
      moduleNumber: 1,
      status: 'completed',
      timeSpentMinutes: 600,
      quizScore: 40,
      projectSubmitted: false,
      selfRatedConfidence: 2,
      engagementScore: 35,
    },
    {
      moduleNumber: 2,
      status: 'completed',
      timeSpentMinutes: 500,
      quizScore: 38,
      projectSubmitted: false,
      selfRatedConfidence: 1,
      engagementScore: 30,
    },
    {
      moduleNumber: 3,
      status: 'in_progress',
      timeSpentMinutes: 60,
      projectSubmitted: false,
      selfRatedConfidence: 1,
      engagementScore: 25,
    },
  ],
  overallProgress: {
    completedModules: 2,
    totalModules: 5,
    completionRate: 40,
    averageQuizScore: 39,
    averageConfidence: 1.3,
    totalTimeSpentMinutes: 1160,
    currentStreak: 1,
    longestStreak: 5,
    lastActiveAt: '2026-03-15T00:00:00Z',
    paceStatus: 'on_track',
  },
  checkIns: [
    {
      id: 'ci-1',
      timestamp: '2026-03-12T00:00:00Z',
      mood: 'frustrated',
      confusingTopics: ['transformers'],
      suggestedAction:
        'Review supplementary resources for: transformers. Consider slowing pace.',
    },
  ],
  adaptationHistory: [],
  lastEvaluatedAt: '2026-03-14T00:00:00Z',
};

/**
 * Payload 7: Confident user evaluation for recommendation test
 */
export const CONFIDENT_EVALUATION: EvaluationData = {
  userId: 'user-123',
  courseId: 'course-456',
  moduleEvaluations: [
    {
      moduleNumber: 1,
      status: 'completed',
      timeSpentMinutes: 300,
      quizScore: 92,
      projectSubmitted: false,
      selfRatedConfidence: 4,
      engagementScore: 85,
    },
    {
      moduleNumber: 2,
      status: 'in_progress',
      startedAt: '2026-03-10T00:00:00Z',
      timeSpentMinutes: 120,
      projectSubmitted: false,
      selfRatedConfidence: 3,
      engagementScore: 70,
    },
    {
      moduleNumber: 3,
      status: 'not_started',
      timeSpentMinutes: 0,
      projectSubmitted: false,
      selfRatedConfidence: 0,
      engagementScore: 0,
    },
  ],
  overallProgress: {
    completedModules: 1,
    totalModules: 3,
    completionRate: 33,
    averageQuizScore: 92,
    averageConfidence: 4,
    totalTimeSpentMinutes: 420,
    currentStreak: 3,
    longestStreak: 3,
    lastActiveAt: '2026-03-15T00:00:00Z',
    paceStatus: 'on_track',
  },
  checkIns: [],
  adaptationHistory: [],
  lastEvaluatedAt: '2026-03-15T00:00:00Z',
};

/**
 * Payload 5: Check-in data for struggling user
 */
export const STRUGGLING_CHECKIN_EVALUATION: EvaluationData = {
  userId: 'user-123',
  courseId: 'course-456',
  moduleEvaluations: [
    {
      moduleNumber: 1,
      status: 'completed',
      timeSpentMinutes: 480,
      quizScore: 45,
      projectSubmitted: false,
      selfRatedConfidence: 2,
      engagementScore: 40,
    },
    {
      moduleNumber: 2,
      status: 'in_progress',
      timeSpentMinutes: 60,
      projectSubmitted: false,
      selfRatedConfidence: 1,
      engagementScore: 30,
    },
  ],
  overallProgress: {
    completedModules: 1,
    totalModules: 5,
    completionRate: 20,
    averageQuizScore: 45,
    averageConfidence: 2,
    totalTimeSpentMinutes: 540,
    currentStreak: 0,
    longestStreak: 3,
    lastActiveAt: '2026-03-10T00:00:00Z',
    paceStatus: 'behind',
  },
  checkIns: [],
  adaptationHistory: [],
  lastEvaluatedAt: '2026-03-10T00:00:00Z',
};
