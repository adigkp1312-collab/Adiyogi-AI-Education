import { describe, it, expect } from 'vitest';
import { POST } from '@/app/api/evaluate/route';
import { NextRequest } from 'next/server';
import {
  MOCK_COURSE,
  EVALUATION_WITH_PROGRESS,
  STRUGGLING_EVALUATION,
  STRUGGLING_CHECKIN_EVALUATION,
  CONFIDENT_EVALUATION,
} from '../fixtures/courses';

function createRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost:3000/api/evaluate', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('POST /api/evaluate', () => {
  // --- Payload 4: update_progress ---

  describe('action: update_progress', () => {
    it('returns 200 with updated evaluation', async () => {
      const res = await POST(
        createRequest({
          action: 'update_progress',
          evaluation: EVALUATION_WITH_PROGRESS,
          data: {
            moduleNumber: 2,
            status: 'completed',
            completedAt: '2026-03-15T12:00:00Z',
            timeSpentMinutes: 360,
            quizScore: 72,
            selfRatedConfidence: 3,
            engagementScore: 70,
          },
        }),
      );
      expect(res.status).toBe(200);

      const data = await res.json();
      const mod2 = data.evaluation.moduleEvaluations.find(
        (m: { moduleNumber: number }) => m.moduleNumber === 2,
      );
      expect(mod2.status).toBe('completed');
      expect(mod2.quizScore).toBe(72);
    });

    it('recalculates overall progress', async () => {
      const res = await POST(
        createRequest({
          action: 'update_progress',
          evaluation: EVALUATION_WITH_PROGRESS,
          data: {
            moduleNumber: 2,
            status: 'completed',
            timeSpentMinutes: 360,
            quizScore: 72,
          },
        }),
      );
      const data = await res.json();
      expect(data.evaluation.overallProgress.completedModules).toBe(2);
    });

    it('returns 400 when moduleNumber is missing', async () => {
      const res = await POST(
        createRequest({
          action: 'update_progress',
          evaluation: EVALUATION_WITH_PROGRESS,
          data: { status: 'completed' },
        }),
      );
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain('moduleNumber');
    });
  });

  // --- Payload 5: check_in ---

  describe('action: check_in', () => {
    it('returns 200 with suggestedAction', async () => {
      const res = await POST(
        createRequest({
          action: 'check_in',
          evaluation: STRUGGLING_CHECKIN_EVALUATION,
          data: {
            mood: 'struggling',
            confusingTopics: ['backpropagation', 'gradient descent'],
            feedbackText:
              "I don't understand the math behind neural networks",
          },
        }),
      );
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.suggestedAction).toContain('backpropagation');
      expect(data.suggestedAction).toContain('gradient descent');
    });

    it('appends check-in to evaluation', async () => {
      const res = await POST(
        createRequest({
          action: 'check_in',
          evaluation: STRUGGLING_CHECKIN_EVALUATION,
          data: {
            mood: 'struggling',
            confusingTopics: ['backpropagation'],
          },
        }),
      );
      const data = await res.json();
      expect(data.evaluation.checkIns.length).toBe(1);
      expect(data.evaluation.checkIns[0].mood).toBe('struggling');
    });

    it('returns 400 when mood is missing', async () => {
      const res = await POST(
        createRequest({
          action: 'check_in',
          evaluation: STRUGGLING_CHECKIN_EVALUATION,
          data: { confusingTopics: [] },
        }),
      );
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain('mood');
    });
  });

  // --- Payload 6: adapt ---

  describe('action: adapt', () => {
    it('returns adapted course with adaptations array', async () => {
      const res = await POST(
        createRequest({
          action: 'adapt',
          evaluation: STRUGGLING_EVALUATION,
          course: MOCK_COURSE,
        }),
      );
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.adaptedCourse).toBeDefined();
      expect(data.adaptations).toBeDefined();
      expect(data.summary).toBeDefined();
    });

    it('triggers quiz_score adaptation for low scores', async () => {
      const res = await POST(
        createRequest({
          action: 'adapt',
          evaluation: STRUGGLING_EVALUATION,
          course: MOCK_COURSE,
        }),
      );
      const data = await res.json();
      const quizAdaptation = data.adaptations.find(
        (a: { trigger: string }) => a.trigger === 'quiz_score',
      );
      expect(quizAdaptation).toBeDefined();
    });

    it('returns 400 when course is missing', async () => {
      const res = await POST(
        createRequest({
          action: 'adapt',
          evaluation: STRUGGLING_EVALUATION,
        }),
      );
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain('course');
    });
  });

  // --- Payload 7: recommend ---

  describe('action: recommend', () => {
    it('returns complete_module for confident in-progress user', async () => {
      const res = await POST(
        createRequest({
          action: 'recommend',
          evaluation: CONFIDENT_EVALUATION,
          course: MOCK_COURSE,
        }),
      );
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.action).toBe('complete_module');
      expect(data.moduleNumber).toBe(2);
    });

    it('returns 400 when course is missing', async () => {
      const res = await POST(
        createRequest({
          action: 'recommend',
          evaluation: CONFIDENT_EVALUATION,
        }),
      );
      expect(res.status).toBe(400);
    });
  });

  // --- General errors ---

  describe('error handling', () => {
    it('returns 400 when evaluation is missing', async () => {
      const res = await POST(
        createRequest({ action: 'update_progress' }),
      );
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain('evaluation');
    });

    it('returns 400 for unknown action', async () => {
      const res = await POST(
        createRequest({
          action: 'unknown_action',
          evaluation: EVALUATION_WITH_PROGRESS,
        }),
      );
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain('Unknown action');
    });
  });
});
