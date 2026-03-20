/**
 * Re-export note: webCrawler uses local data (KNOWN_FREE_COURSES, SEED_QUESTIONS)
 * so no mocking is needed — the real module works without external deps.
 *
 * This file exists for tests that need to override the default behavior.
 */
import { vi } from 'vitest';

export function mockWebCrawlerEmpty() {
  return vi.mock('@/services/webCrawler', () => ({
    searchKnownCourses: vi.fn().mockReturnValue([]),
    getKnownCourses: vi.fn().mockReturnValue([]),
    getSeedQuestions: vi.fn().mockReturnValue([]),
    crawlCourseSource: vi.fn().mockResolvedValue([]),
    crawlAllSources: vi.fn().mockResolvedValue([]),
    COURSE_SOURCES: [],
  }));
}
