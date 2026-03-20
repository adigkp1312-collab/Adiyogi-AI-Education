import { describe, it, expect } from 'vitest';
import {
  searchKnownCourses,
  getKnownCourses,
  getSeedQuestions,
} from '@/services/webCrawler';

describe('webCrawler', () => {
  // --- Payload 11: searchKnownCourses("agents", { level: "intermediate", free: true }) ---

  describe('searchKnownCourses("agents", { level: "intermediate", free: true })', () => {
    const results = searchKnownCourses('agents', {
      level: 'intermediate',
      free: true,
    });

    it('returns 3 agent-related intermediate courses', () => {
      expect(results.length).toBe(3);
    });

    it('includes AI Agents Course from Hugging Face', () => {
      const hfCourse = results.find((c) => c.provider === 'Hugging Face');
      expect(hfCourse).toBeDefined();
      expect(hfCourse!.title).toBe('AI Agents Course');
      expect(hfCourse!.url).toBe(
        'https://huggingface.co/learn/agents-course',
      );
    });

    it('includes LangChain course from DeepLearning.AI', () => {
      const lcCourse = results.find((c) =>
        c.title.includes('LangChain'),
      );
      expect(lcCourse).toBeDefined();
      expect(lcCourse!.platform).toBe('deeplearningai');
    });

    it('includes Building AI Agents with Vertex AI', () => {
      const vertexCourse = results.find((c) =>
        c.title.includes('Vertex AI'),
      );
      expect(vertexCourse).toBeDefined();
      expect(vertexCourse!.provider).toBe('Google Cloud');
    });

    it('all results are free', () => {
      for (const c of results) {
        expect(c.free).toBe(true);
      }
    });

    it('all results are intermediate level', () => {
      for (const c of results) {
        expect(c.level).toBe('intermediate');
      }
    });

    it('all results contain "agents" in title, description, or topics', () => {
      for (const c of results) {
        const hasAgents =
          c.title.toLowerCase().includes('agents') ||
          c.description.toLowerCase().includes('agents') ||
          c.topics.some((t) => t.toLowerCase().includes('agents'));
        expect(hasAgents).toBe(true);
      }
    });

    it('each result has a unique id', () => {
      const ids = results.map((c) => c.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  // --- Level filtering ---

  describe('searchKnownCourses with level filter', () => {
    it('excludes beginner courses when level=intermediate', () => {
      const results = searchKnownCourses('deep learning', {
        level: 'intermediate',
      });
      for (const c of results) {
        expect(c.level).toBe('intermediate');
      }
    });

    it('returns beginner courses when level=beginner', () => {
      const results = searchKnownCourses('machine learning', {
        level: 'beginner',
      });
      for (const c of results) {
        expect(c.level).toBe('beginner');
      }
    });
  });

  // --- No results ---

  describe('searchKnownCourses with no matches', () => {
    it('returns empty array for unknown topic', () => {
      const results = searchKnownCourses('quantum computing');
      expect(results).toEqual([]);
    });
  });

  // --- getKnownCourses() ---

  describe('getKnownCourses()', () => {
    const courses = getKnownCourses();

    it('returns all 9 pre-indexed courses', () => {
      expect(courses.length).toBe(9);
    });

    it('all courses have valid URLs', () => {
      for (const c of courses) {
        expect(c.url).toMatch(/^https?:\/\//);
      }
    });

    it('all courses are free', () => {
      for (const c of courses) {
        expect(c.free).toBe(true);
      }
    });

    it('all courses have required fields', () => {
      for (const c of courses) {
        expect(c.id).toBeDefined();
        expect(c.title).toBeDefined();
        expect(c.provider).toBeDefined();
        expect(c.platform).toBeDefined();
        expect(c.topics.length).toBeGreaterThan(0);
      }
    });
  });

  // --- getSeedQuestions() ---

  describe('getSeedQuestions()', () => {
    const questions = getSeedQuestions();

    it('returns 6 seed questions', () => {
      expect(questions.length).toBe(6);
    });

    it('all questions have required fields', () => {
      for (const q of questions) {
        expect(q.id).toBeDefined();
        expect(q.text).toBeDefined();
        expect(q.type).toBeDefined();
        expect(q.category).toBeDefined();
        expect(q.source).toBe('seed');
        expect(q.language).toBe('en');
        expect(q.tags.length).toBeGreaterThan(0);
        expect(q.createdAt).toBeDefined();
        expect(q.updatedAt).toBeDefined();
      }
    });

    it('covers multiple categories', () => {
      const categories = new Set(questions.map((q) => q.category));
      expect(categories.has('skills')).toBe(true);
      expect(categories.has('goals')).toBe(true);
    });

    it('skills category has 4 questions', () => {
      const skills = questions.filter((q) => q.category === 'skills');
      expect(skills.length).toBe(4);
    });

    it('goals category has 2 questions', () => {
      const goals = questions.filter((q) => q.category === 'goals');
      expect(goals.length).toBe(2);
    });

    it('all questions with options have valid option structure', () => {
      for (const q of questions) {
        if (q.options) {
          for (const opt of q.options) {
            expect(opt.id).toBeDefined();
            expect(opt.label).toBeDefined();
            expect(opt.value).toBeDefined();
          }
        }
      }
    });
  });
});
