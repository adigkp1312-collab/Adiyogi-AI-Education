import { describe, it, expect, vi } from 'vitest';

// Mock vertexDatastore (forces seed/webCrawler fallback)
vi.mock('@/services/vertexDatastore', () => ({
  searchCourseIndex: vi.fn().mockResolvedValue([]),
  searchQuestions: vi.fn().mockResolvedValue([]),
}));

import { curateCourse } from '@/services/curatorService';
import { evaluationEngine } from '@/services/evaluationEngine';
import { adaptCourse, getNextRecommendation } from '@/services/adaptiveLearning';
import { BEGINNER_PROFILE } from '../fixtures/profiles';

describe('E2E: Full Curation Pipeline', () => {
  it('runs the complete flow: profile → course → evaluation → adaptation → recommendation', async () => {
    // --- Step 1: Curate course from beginner profile ---
    const course = await curateCourse(BEGINNER_PROFILE);

    expect(course.status).toBe('ready');
    expect(course.title).toBe('Personalized AI Learning Path for Priya Sharma');
    expect(course.modules.length).toBeGreaterThan(0);
    expect(course.modules.length).toBeLessThanOrEqual(5);
    expect(course.learner.name).toBe('Priya Sharma');
    expect(course.learner.preferred_language).toBe('hi');
    expect(course.completed_modules).toEqual([]);

    // --- Step 2: Create fresh evaluation ---
    const evaluation = evaluationEngine.createEvaluation('user-e2e', course);

    expect(evaluation.userId).toBe('user-e2e');
    expect(evaluation.courseId).toBe(course.id);
    expect(evaluation.moduleEvaluations.length).toBe(course.modules.length);
    expect(evaluation.overallProgress.completedModules).toBe(0);
    expect(evaluation.overallProgress.paceStatus).toBe('on_track');

    // --- Step 3: Complete module 1 with good score ---
    const afterModule1 = evaluationEngine.updateModuleProgress(evaluation, 1, {
      status: 'completed',
      completedAt: '2026-03-10T00:00:00Z',
      timeSpentMinutes: 480,
      quizScore: 88,
      selfRatedConfidence: 4,
      engagementScore: 80,
    });

    expect(afterModule1.overallProgress.completedModules).toBe(1);
    const mod1 = afterModule1.moduleEvaluations.find((m) => m.moduleNumber === 1);
    expect(mod1!.status).toBe('completed');
    expect(mod1!.quizScore).toBe(88);

    // --- Step 4: Start module 2 ---
    const afterModule2Start = evaluationEngine.updateModuleProgress(afterModule1, 2, {
      status: 'in_progress',
      startedAt: '2026-03-11T00:00:00Z',
      timeSpentMinutes: 60,
      selfRatedConfidence: 2,
    });

    // --- Step 5: Check-in (user is okay) ---
    const checkInResult = evaluationEngine.recordCheckIn(
      afterModule2Start,
      'good',
      [],
    );
    expect(checkInResult.evaluation.checkIns.length).toBe(1);
    expect(checkInResult.evaluation.checkIns[0].mood).toBe('good');

    // --- Step 6: Adapt course (should be fine — no adaptation needed) ---
    const adaptResult = adaptCourse(course, checkInResult.evaluation);
    expect(adaptResult.adaptations).toHaveLength(0);
    expect(adaptResult.summary).toContain('No adaptations needed');

    // --- Step 7: Get recommendation ---
    const rec = getNextRecommendation(course, afterModule2Start);
    expect(rec.action).toBe('continue_module');
    expect(rec.moduleNumber).toBe(2);

    // --- Step 8: Complete module 2 with confidence → get complete_module recommendation ---
    const afterModule2Done = evaluationEngine.updateModuleProgress(afterModule2Start, 2, {
      status: 'in_progress', // still in progress but confident
      timeSpentMinutes: 300,
      selfRatedConfidence: 4,
    });
    const recAfterConfidence = getNextRecommendation(course, afterModule2Done);
    expect(recAfterConfidence.action).toBe('complete_module');
    expect(recAfterConfidence.moduleNumber).toBe(2);
  });

  it('handles struggling user flow: low scores → adaptation → easier content', async () => {
    const course = await curateCourse(BEGINNER_PROFILE);
    const evaluation = evaluationEngine.createEvaluation('user-struggle', course);

    // Complete module 1 with low score
    const after1 = evaluationEngine.updateModuleProgress(evaluation, 1, {
      status: 'completed',
      timeSpentMinutes: 600,
      quizScore: 35,
      selfRatedConfidence: 1,
    });

    // Complete module 2 with low score
    const after2 = evaluationEngine.updateModuleProgress(after1, 2, {
      status: 'completed',
      timeSpentMinutes: 500,
      quizScore: 42,
      selfRatedConfidence: 2,
    });

    // Start module 3
    const after3 = evaluationEngine.updateModuleProgress(after2, 3, {
      status: 'in_progress',
      timeSpentMinutes: 30,
      selfRatedConfidence: 1,
    });

    // Adapt — should trigger quiz_score adaptation
    const adaptResult = adaptCourse(course, after3);
    expect(adaptResult.adaptations.length).toBeGreaterThanOrEqual(1);

    const quizAdaptation = adaptResult.adaptations.find(
      (a) => a.trigger === 'quiz_score',
    );
    expect(quizAdaptation).toBeDefined();

    // Module 3 should have extra practice
    const mod3 = adaptResult.adaptedCourse.modules.find(
      (m) => m.module_number === 3,
    );
    if (mod3) {
      expect(mod3.practice).toContain(
        'Review foundational concepts before proceeding',
      );
    }
  });
});
