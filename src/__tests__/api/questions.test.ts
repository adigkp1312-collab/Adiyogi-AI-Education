import { describe, it, expect, vi } from 'vitest';

// Mock vertexDatastore to return empty (forces seed fallback)
vi.mock('@/services/vertexDatastore', () => ({
  searchCourseIndex: vi.fn().mockResolvedValue([]),
  searchQuestions: vi.fn().mockResolvedValue([]),
}));

import { GET, POST } from '@/app/api/questions/route';
import { NextRequest } from 'next/server';

function createGetRequest(params: Record<string, string> = {}): NextRequest {
  const url = new URL('http://localhost:3000/api/questions');
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return new NextRequest(url.toString(), { method: 'GET' });
}

function createPostRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost:3000/api/questions', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('GET /api/questions', () => {
  // --- Payload 8: category=skills, limit=3 ---

  describe('with category=skills and limit=3', () => {
    it('returns 200 with filtered questions', async () => {
      const res = await GET(createGetRequest({ category: 'skills', limit: '3' }));
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.questions).toBeDefined();
      expect(data.total).toBeDefined();
      expect(data.source).toBeDefined();
    });

    it('returns only skills category questions', async () => {
      const res = await GET(createGetRequest({ category: 'skills', limit: '3' }));
      const data = await res.json();

      for (const q of data.questions) {
        expect(q.category).toBe('skills');
      }
    });

    it('returns exactly 3 results', async () => {
      const res = await GET(createGetRequest({ category: 'skills', limit: '3' }));
      const data = await res.json();
      expect(data.questions.length).toBe(3);
      expect(data.total).toBe(3);
    });

    it('source is "seed" (Vertex unavailable)', async () => {
      const res = await GET(createGetRequest({ category: 'skills', limit: '3' }));
      const data = await res.json();
      expect(data.source).toBe('seed');
    });

    it('excludes goals category questions', async () => {
      const res = await GET(createGetRequest({ category: 'skills', limit: '10' }));
      const data = await res.json();

      for (const q of data.questions) {
        expect(q.category).not.toBe('goals');
      }
    });

    it('each question has id, createdAt, updatedAt', async () => {
      const res = await GET(createGetRequest({ category: 'skills', limit: '3' }));
      const data = await res.json();

      for (const q of data.questions) {
        expect(q.id).toBeDefined();
        expect(q.createdAt).toBeDefined();
        expect(q.updatedAt).toBeDefined();
      }
    });
  });

  // --- Payload 9: adaptive context (advanced user) ---

  describe('with adaptive context for advanced user', () => {
    it('filters out basic/prerequisites questions', async () => {
      const res = await GET(
        createGetRequest({
          limit: '10',
          context: JSON.stringify({ experience: 'advanced' }),
        }),
      );
      const data = await res.json();

      for (const q of data.questions) {
        expect(q.tags).not.toContain('prerequisites');
      }
    });

    it('excludes math question (tagged prerequisites)', async () => {
      const res = await GET(
        createGetRequest({
          limit: '10',
          context: JSON.stringify({ experience: 'advanced' }),
        }),
      );
      const data = await res.json();

      const mathQ = data.questions.find((q: { text: string }) =>
        q.text.includes('math concepts'),
      );
      expect(mathQ).toBeUndefined();
    });

    it('keeps deployment question for advanced users (only "basic"/"prerequisites" filtered)', async () => {
      // The adaptive filter for advanced only removes tags: "basic" and "prerequisites"
      // "deployment" tag is NOT filtered — it's relevant for advanced users
      const res = await GET(
        createGetRequest({
          limit: '10',
          context: JSON.stringify({ experience: 'advanced' }),
        }),
      );
      const data = await res.json();

      const deployQ = data.questions.find((q: { text: string }) =>
        q.text.includes('deployed any application'),
      );
      expect(deployQ).toBeDefined();
    });

    it('sorts by effectivenessScore descending', async () => {
      const res = await GET(
        createGetRequest({
          limit: '10',
          context: JSON.stringify({ experience: 'advanced' }),
        }),
      );
      const data = await res.json();

      for (let i = 1; i < data.questions.length; i++) {
        expect(data.questions[i - 1].effectivenessScore).toBeGreaterThanOrEqual(
          data.questions[i].effectivenessScore,
        );
      }
    });
  });

  // --- Default (no filters) ---

  describe('without filters', () => {
    it('returns default 5 questions', async () => {
      const res = await GET(createGetRequest());
      const data = await res.json();
      expect(data.questions.length).toBe(5);
    });
  });
});

// --- Payload 10: POST /api/questions (feedback) ---

describe('POST /api/questions', () => {
  it('returns success for valid feedback', async () => {
    const res = await POST(
      createPostRequest({ questionId: 'q-abc-123', useful: true }),
    );
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.message).toContain('q-abc-123');
    expect(data.message).toContain('useful');
  });

  it('returns 400 when questionId is missing', async () => {
    const res = await POST(createPostRequest({}));
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toContain('questionId');
  });
});
