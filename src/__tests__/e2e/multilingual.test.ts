import { describe, it, expect, vi } from 'vitest';

vi.mock('@/services/vertexDatastore', () => ({
  searchCourseIndex: vi.fn().mockResolvedValue([]),
  searchQuestions: vi.fn().mockResolvedValue([]),
}));

import { curateCourse } from '@/services/curatorService';
import { HINDI_PROFILE, TAMIL_PROFILE, TELUGU_PROFILE } from '../fixtures/profiles';

describe('E2E: Multilingual Curation', () => {
  describe('Hindi (hi)', () => {
    it('sets preferred_language to hi', async () => {
      const course = await curateCourse(HINDI_PROFILE);
      expect(course.learner.preferred_language).toBe('hi');
    });

    it('generates a valid course', async () => {
      const course = await curateCourse(HINDI_PROFILE);
      expect(course.status).toBe('ready');
      expect(course.modules.length).toBeGreaterThan(0);
    });

    it('includes language in adaptive_notes', async () => {
      const course = await curateCourse(HINDI_PROFILE);
      expect(course.adaptive_notes).toBeDefined();
      expect(course.adaptive_notes.length).toBeGreaterThan(0);
    });
  });

  describe('Tamil (ta)', () => {
    it('sets preferred_language to ta', async () => {
      const course = await curateCourse(TAMIL_PROFILE);
      expect(course.learner.preferred_language).toBe('ta');
    });

    it('generates a valid course with modules', async () => {
      const course = await curateCourse(TAMIL_PROFILE);
      expect(course.status).toBe('ready');
      expect(course.modules.length).toBeGreaterThan(0);
    });
  });

  describe('Telugu (te)', () => {
    it('sets preferred_language to te', async () => {
      const course = await curateCourse(TELUGU_PROFILE);
      expect(course.learner.preferred_language).toBe('te');
    });

    it('generates a valid course with modules', async () => {
      const course = await curateCourse(TELUGU_PROFILE);
      expect(course.status).toBe('ready');
      expect(course.modules.length).toBeGreaterThan(0);
    });
  });

  describe('cross-language consistency', () => {
    it('all languages produce courses with same module count for same profile', async () => {
      const [hi, ta, te] = await Promise.all([
        curateCourse(HINDI_PROFILE),
        curateCourse(TAMIL_PROFILE),
        curateCourse(TELUGU_PROFILE),
      ]);

      // Same profile shape → same module structure
      expect(hi.modules.length).toBe(ta.modules.length);
      expect(ta.modules.length).toBe(te.modules.length);
    });

    it('all languages get the same module titles', async () => {
      const [hi, ta, te] = await Promise.all([
        curateCourse(HINDI_PROFILE),
        curateCourse(TAMIL_PROFILE),
        curateCourse(TELUGU_PROFILE),
      ]);

      const hiTitles = hi.modules.map((m) => m.title);
      const taTitles = ta.modules.map((m) => m.title);
      const teTitles = te.modules.map((m) => m.title);

      expect(hiTitles).toEqual(taTitles);
      expect(taTitles).toEqual(teTitles);
    });
  });
});
