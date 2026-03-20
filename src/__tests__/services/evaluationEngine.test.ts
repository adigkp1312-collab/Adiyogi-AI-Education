import { describe, it, expect } from 'vitest';
import { evaluationEngine } from '@/services/evaluationEngine';
import { MOCK_COURSE, EVALUATION_WITH_PROGRESS, STRUGGLING_CHECKIN_EVALUATION } from '../fixtures/courses';

describe('evaluationEngine', () => {
  // --- Payload 13: createEvaluation() ---

  describe('createEvaluation()', () => {
    const evaluation = evaluationEngine.createEvaluation('user-789', MOCK_COURSE);

    it('sets userId correctly', () => {
      expect(evaluation.userId).toBe('user-789');
    });

    it('sets courseId from course', () => {
      expect(evaluation.courseId).toBe(MOCK_COURSE.id);
    });

    it('creates one moduleEvaluation per module', () => {
      expect(evaluation.moduleEvaluations.length).toBe(
        MOCK_COURSE.modules.length,
      );
    });

    it('all modules start as not_started', () => {
      for (const m of evaluation.moduleEvaluations) {
        expect(m.status).toBe('not_started');
      }
    });

    it('all numeric fields start at 0', () => {
      for (const m of evaluation.moduleEvaluations) {
        expect(m.timeSpentMinutes).toBe(0);
        expect(m.selfRatedConfidence).toBe(0);
        expect(m.engagementScore).toBe(0);
        expect(m.projectSubmitted).toBe(false);
      }
    });

    it('overallProgress starts at zero', () => {
      expect(evaluation.overallProgress.completedModules).toBe(0);
      expect(evaluation.overallProgress.totalModules).toBe(3);
      expect(evaluation.overallProgress.completionRate).toBe(0);
      expect(evaluation.overallProgress.averageQuizScore).toBe(0);
      expect(evaluation.overallProgress.averageConfidence).toBe(0);
      expect(evaluation.overallProgress.totalTimeSpentMinutes).toBe(0);
      expect(evaluation.overallProgress.currentStreak).toBe(0);
      expect(evaluation.overallProgress.longestStreak).toBe(0);
    });

    it('paceStatus starts as on_track', () => {
      expect(evaluation.overallProgress.paceStatus).toBe('on_track');
    });

    it('starts with empty checkIns and adaptationHistory', () => {
      expect(evaluation.checkIns).toEqual([]);
      expect(evaluation.adaptationHistory).toEqual([]);
    });

    it('has lastEvaluatedAt timestamp', () => {
      expect(evaluation.lastEvaluatedAt).toBeDefined();
    });
  });

  // --- Payload 4: updateModuleProgress() ---

  describe('updateModuleProgress()', () => {
    const updated = evaluationEngine.updateModuleProgress(
      EVALUATION_WITH_PROGRESS,
      2,
      {
        status: 'completed',
        completedAt: '2026-03-15T12:00:00Z',
        timeSpentMinutes: 360,
        quizScore: 72,
        selfRatedConfidence: 3,
        engagementScore: 70,
      },
    );

    it('updates module 2 status to completed', () => {
      const mod2 = updated.moduleEvaluations.find((m) => m.moduleNumber === 2);
      expect(mod2!.status).toBe('completed');
    });

    it('updates module 2 completedAt', () => {
      const mod2 = updated.moduleEvaluations.find((m) => m.moduleNumber === 2);
      expect(mod2!.completedAt).toBe('2026-03-15T12:00:00Z');
    });

    it('updates module 2 quizScore', () => {
      const mod2 = updated.moduleEvaluations.find((m) => m.moduleNumber === 2);
      expect(mod2!.quizScore).toBe(72);
    });

    it('recalculates completedModules to 2', () => {
      expect(updated.overallProgress.completedModules).toBe(2);
    });

    it('recalculates completionRate to 67', () => {
      expect(updated.overallProgress.completionRate).toBe(67);
    });

    it('recalculates averageQuizScore to 79', () => {
      // (85 + 72) / 2 = 78.5 → rounded to 79
      expect(updated.overallProgress.averageQuizScore).toBe(79);
    });

    it('does not modify module 1 (already completed)', () => {
      const mod1 = updated.moduleEvaluations.find((m) => m.moduleNumber === 1);
      expect(mod1!.quizScore).toBe(85);
      expect(mod1!.status).toBe('completed');
    });

    it('does not modify module 3 (still not_started)', () => {
      const mod3 = updated.moduleEvaluations.find((m) => m.moduleNumber === 3);
      expect(mod3!.status).toBe('not_started');
    });

    it('returns original evaluation for non-existent module', () => {
      const unchanged = evaluationEngine.updateModuleProgress(
        EVALUATION_WITH_PROGRESS,
        999,
        { status: 'completed' },
      );
      expect(unchanged).toBe(EVALUATION_WITH_PROGRESS);
    });
  });

  // --- Payload 5: recordCheckIn() ---

  describe('recordCheckIn()', () => {
    const result = evaluationEngine.recordCheckIn(
      STRUGGLING_CHECKIN_EVALUATION,
      'struggling',
      ['backpropagation', 'gradient descent'],
      "I don't understand the math behind neural networks",
    );

    it('appends new check-in to evaluation', () => {
      expect(result.evaluation.checkIns.length).toBe(1);
    });

    it('sets check-in mood to struggling', () => {
      expect(result.evaluation.checkIns[0].mood).toBe('struggling');
    });

    it('includes confusingTopics', () => {
      expect(result.evaluation.checkIns[0].confusingTopics).toEqual([
        'backpropagation',
        'gradient descent',
      ]);
    });

    it('includes feedbackText', () => {
      expect(result.evaluation.checkIns[0].feedbackText).toBe(
        "I don't understand the math behind neural networks",
      );
    });

    it('generates suggestedAction referencing confusing topics', () => {
      expect(result.suggestedAction).toContain('backpropagation');
      expect(result.suggestedAction).toContain('gradient descent');
    });

    it('has uuid id on check-in', () => {
      expect(result.evaluation.checkIns[0].id).toBeDefined();
    });

    it('has timestamp on check-in', () => {
      expect(result.evaluation.checkIns[0].timestamp).toBeDefined();
    });
  });

  // --- evaluateForAdaptation() ---

  describe('evaluateForAdaptation()', () => {
    it('triggers quiz_score adaptation when avg < 50', () => {
      const adaptation = evaluationEngine.evaluateForAdaptation({
        ...EVALUATION_WITH_PROGRESS,
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
        ],
      });
      expect(adaptation).not.toBeNull();
      expect(adaptation!.trigger).toBe('quiz_score');
      expect(adaptation!.changes[0].type).toBe('difficulty_adjust');
    });

    it('triggers quiz_score acceleration when avg > 90', () => {
      const adaptation = evaluationEngine.evaluateForAdaptation({
        ...EVALUATION_WITH_PROGRESS,
        moduleEvaluations: [
          {
            moduleNumber: 1,
            status: 'completed',
            timeSpentMinutes: 300,
            quizScore: 95,
            projectSubmitted: false,
            selfRatedConfidence: 5,
            engagementScore: 90,
          },
          {
            moduleNumber: 2,
            status: 'completed',
            timeSpentMinutes: 280,
            quizScore: 92,
            projectSubmitted: false,
            selfRatedConfidence: 5,
            engagementScore: 90,
          },
        ],
      });
      expect(adaptation).not.toBeNull();
      expect(adaptation!.trigger).toBe('quiz_score');
      expect(adaptation!.description).toContain('accelerating');
    });

    it('triggers inactivity adaptation when stalled', () => {
      const adaptation = evaluationEngine.evaluateForAdaptation({
        ...EVALUATION_WITH_PROGRESS,
        overallProgress: {
          ...EVALUATION_WITH_PROGRESS.overallProgress,
          paceStatus: 'stalled',
        },
      });
      expect(adaptation).not.toBeNull();
      expect(adaptation!.trigger).toBe('inactivity');
    });

    it('triggers check_in adaptation when 2+ frustrated check-ins', () => {
      const adaptation = evaluationEngine.evaluateForAdaptation({
        ...EVALUATION_WITH_PROGRESS,
        checkIns: [
          {
            id: '1',
            timestamp: '2026-03-13T00:00:00Z',
            mood: 'frustrated',
            confusingTopics: [],
            suggestedAction: '',
          },
          {
            id: '2',
            timestamp: '2026-03-14T00:00:00Z',
            mood: 'struggling',
            confusingTopics: [],
            suggestedAction: '',
          },
          {
            id: '3',
            timestamp: '2026-03-15T00:00:00Z',
            mood: 'frustrated',
            confusingTopics: [],
            suggestedAction: '',
          },
        ],
      });
      expect(adaptation).not.toBeNull();
      expect(adaptation!.trigger).toBe('check_in');
      expect(adaptation!.changes.length).toBe(2);
    });

    it('returns null when no adaptation needed', () => {
      const adaptation = evaluationEngine.evaluateForAdaptation(
        EVALUATION_WITH_PROGRESS,
      );
      expect(adaptation).toBeNull();
    });
  });
});
