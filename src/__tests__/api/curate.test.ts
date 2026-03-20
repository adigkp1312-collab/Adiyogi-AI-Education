import { describe, it, expect, vi } from 'vitest';

// Mock vertexDatastore before importing the route
vi.mock('@/services/vertexDatastore', () => ({
  searchCourseIndex: vi.fn().mockResolvedValue([]),
  searchQuestions: vi.fn().mockResolvedValue([]),
}));

import { POST } from '@/app/api/curate/route';
import { NextRequest } from 'next/server';
import { BEGINNER_PROFILE, ADVANCED_PROFILE } from '../fixtures/profiles';

function createRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost:3000/api/curate', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('POST /api/curate', () => {
  // --- Payload 1: Beginner profile → 200 ---

  describe('beginner profile (Priya Sharma)', () => {
    it('returns 200 with CourseJSON', async () => {
      const res = await POST(createRequest(BEGINNER_PROFILE));
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.course).toBeDefined();
      expect(data.message).toBeDefined();
    });

    it('returns correct course structure', async () => {
      const res = await POST(createRequest(BEGINNER_PROFILE));
      const { course } = await res.json();

      expect(course.status).toBe('ready');
      expect(course.title).toBe(
        'Personalized AI Learning Path for Priya Sharma',
      );
      expect(course.skill_level).toBe('beginner');
      expect(course.modules.length).toBeLessThanOrEqual(5);
      expect(course.completed_modules).toEqual([]);
    });

    it('returns message with module count', async () => {
      const res = await POST(createRequest(BEGINNER_PROFILE));
      const data = await res.json();

      expect(data.message).toMatch(/Personalized course created with \d+ modules/);
    });
  });

  // --- Payload 2: Advanced profile → 200 ---

  describe('advanced profile (Rahul Verma)', () => {
    it('returns 200', async () => {
      const res = await POST(createRequest(ADVANCED_PROFILE));
      expect(res.status).toBe(200);
    });

    it('skips foundation modules', async () => {
      const res = await POST(createRequest(ADVANCED_PROFILE));
      const { course } = await res.json();

      const titles = course.modules.map((m: { title: string }) => m.title);
      expect(titles).not.toContain('Python Programming Fundamentals');
      expect(titles).not.toContain('Introduction to AI & Machine Learning');
    });
  });

  // --- Payload 3: Validation errors → 400 ---

  describe('validation errors', () => {
    it('returns 400 when goals is empty', async () => {
      const res = await POST(
        createRequest({
          name: 'Test User',
          language: 'en',
          experienceLevel: 'beginner',
          goals: [],
        }),
      );
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe(
        'Profile must include name and at least one goal',
      );
    });

    it('returns 400 when name is missing', async () => {
      const res = await POST(
        createRequest({
          goals: ['Learn AI'],
        }),
      );
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe(
        'Profile must include name and at least one goal',
      );
    });

    it('returns 400 when goals is missing', async () => {
      const res = await POST(
        createRequest({
          name: 'Test User',
        }),
      );
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe(
        'Profile must include name and at least one goal',
      );
    });
  });
});
