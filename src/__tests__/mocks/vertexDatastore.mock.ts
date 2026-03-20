import { vi } from 'vitest';

/**
 * Mock vertexDatastore to return empty results,
 * forcing all code paths to fall back to webCrawler / seed data.
 */
vi.mock('@/services/vertexDatastore', () => ({
  searchCourseIndex: vi.fn().mockResolvedValue([]),
  searchQuestions: vi.fn().mockResolvedValue([]),
}));
