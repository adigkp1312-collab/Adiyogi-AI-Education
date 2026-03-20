import { describe, it, expect } from 'vitest';
import { adaptCourse, getNextRecommendation } from '@/services/adaptiveLearning';
import {
  MOCK_COURSE,
  STRUGGLING_EVALUATION,
  CONFIDENT_EVALUATION,
  EVALUATION_WITH_PROGRESS,
} from '../fixtures/courses';

describe('adaptiveLearning', () => {
  // --- Payload 6: adaptCourse() with struggling user ---

  describe('adaptCourse() with struggling user (avg quiz < 50)', () => {
    const result = adaptCourse(MOCK_COURSE, STRUGGLING_EVALUATION);

    it('triggers at least 1 adaptation', () => {
      expect(result.adaptations.length).toBeGreaterThanOrEqual(1);
    });

    it('triggers quiz_score adaptation', () => {
      const quizAdaptation = result.adaptations.find(
        (a) => a.trigger === 'quiz_score',
      );
      expect(quizAdaptation).toBeDefined();
    });

    it('adaptation describes low quiz score', () => {
      const quizAdaptation = result.adaptations.find(
        (a) => a.trigger === 'quiz_score',
      );
      expect(quizAdaptation!.description).toContain('39%');
      expect(quizAdaptation!.description).toContain('remedial');
    });

    it('adds extra practice to in-progress module (module 3)', () => {
      const mod3 = result.adaptedCourse.modules.find(
        (m) => m.module_number === 3,
      );
      expect(mod3!.practice).toContain(
        'Review foundational concepts before proceeding',
      );
      expect(mod3!.practice).toContain(
        'Work through additional guided examples',
      );
    });

    it('changes assessment for in-progress module to simplified', () => {
      const mod3 = result.adaptedCourse.modules.find(
        (m) => m.module_number === 3,
      );
      expect(mod3!.assessment).toContain('Simplified assessment');
    });

    it('does NOT modify completed modules', () => {
      const mod1 = result.adaptedCourse.modules.find(
        (m) => m.module_number === 1,
      );
      // Completed modules keep original assessment
      expect(mod1!.assessment).toBe(
        'Quiz on key concepts + submit summary notes',
      );
    });

    it('updates adaptive_notes with current stats', () => {
      expect(result.adaptedCourse.adaptive_notes).toContain('2/5 modules');
      expect(result.adaptedCourse.adaptive_notes).toContain('40%');
    });

    it('updates updated_at timestamp', () => {
      expect(result.adaptedCourse.updated_at).toBeGreaterThan(
        MOCK_COURSE.updated_at,
      );
    });

    it('generates summary string', () => {
      expect(result.summary).toContain('Applied 1 adaptation');
    });
  });

  // --- adaptCourse() with on-track user ---

  describe('adaptCourse() with on-track user', () => {
    const result = adaptCourse(MOCK_COURSE, EVALUATION_WITH_PROGRESS);

    it('applies no adaptations when user is on track', () => {
      expect(result.adaptations).toHaveLength(0);
    });

    it('summary says no adaptations needed', () => {
      expect(result.summary).toContain('No adaptations needed');
    });
  });

  // --- Payload 7: getNextRecommendation() ---

  describe('getNextRecommendation() with confident in-progress user', () => {
    const rec = getNextRecommendation(MOCK_COURSE, CONFIDENT_EVALUATION);

    it('returns "complete_module" action', () => {
      expect(rec.action).toBe('complete_module');
    });

    it('targets module 2 (in-progress with confidence >= 3)', () => {
      expect(rec.moduleNumber).toBe(2);
    });

    it('reason mentions assessment', () => {
      expect(rec.reason).toContain('assessment');
    });
  });

  describe('getNextRecommendation() with user at module start', () => {
    it('returns "continue_module" when low confidence', () => {
      const lowConfidence = {
        ...CONFIDENT_EVALUATION,
        moduleEvaluations: [
          ...CONFIDENT_EVALUATION.moduleEvaluations.slice(0, 1),
          {
            ...CONFIDENT_EVALUATION.moduleEvaluations[1],
            selfRatedConfidence: 1, // low confidence
          },
          ...CONFIDENT_EVALUATION.moduleEvaluations.slice(2),
        ],
      };
      const rec = getNextRecommendation(MOCK_COURSE, lowConfidence);
      expect(rec.action).toBe('continue_module');
      expect(rec.moduleNumber).toBe(2);
    });
  });

  describe('getNextRecommendation() with all completed', () => {
    it('returns "start_module" when next module is not_started', () => {
      const allDoneExceptLast = {
        ...CONFIDENT_EVALUATION,
        moduleEvaluations: [
          {
            ...CONFIDENT_EVALUATION.moduleEvaluations[0],
            status: 'completed' as const,
          },
          {
            ...CONFIDENT_EVALUATION.moduleEvaluations[1],
            status: 'completed' as const,
          },
          {
            ...CONFIDENT_EVALUATION.moduleEvaluations[2],
            status: 'not_started' as const,
          },
        ],
      };
      const rec = getNextRecommendation(MOCK_COURSE, allDoneExceptLast);
      expect(rec.action).toBe('start_module');
      expect(rec.moduleNumber).toBe(3);
    });

    it('returns "course_complete" when all modules done', () => {
      const allDone = {
        ...CONFIDENT_EVALUATION,
        moduleEvaluations: CONFIDENT_EVALUATION.moduleEvaluations.map((m) => ({
          ...m,
          status: 'completed' as const,
        })),
        overallProgress: {
          ...CONFIDENT_EVALUATION.overallProgress,
          completionRate: 100,
        },
      };
      const rec = getNextRecommendation(MOCK_COURSE, allDone);
      expect(rec.action).toBe('course_complete');
    });
  });
});
