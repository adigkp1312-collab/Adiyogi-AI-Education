import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock vertexDatastore to return empty (forces webCrawler fallback)
vi.mock('@/services/vertexDatastore', () => ({
  searchCourseIndex: vi.fn().mockResolvedValue([]),
  searchQuestions: vi.fn().mockResolvedValue([]),
}));

import { curateCourse } from '@/services/curatorService';
import {
  BEGINNER_PROFILE,
  ADVANCED_PROFILE,
  NONE_EXPERIENCE_PROFILE,
  ALL_INTERESTS_PROFILE,
  ZERO_HOURS_PROFILE,
} from '../fixtures/profiles';

describe('curatorService.curateCourse()', () => {
  // --- Payload 1: Beginner Profile ---

  describe('beginner profile (Priya Sharma)', () => {
    it('returns a valid CourseJSON with status "ready"', async () => {
      const course = await curateCourse(BEGINNER_PROFILE);
      expect(course.status).toBe('ready');
      expect(course.id).toBeDefined();
      expect(course.created_at).toBeTypeOf('number');
      expect(course.updated_at).toBeTypeOf('number');
    });

    it('limits modules to 5 (availableHoursPerWeek=8 < 10)', async () => {
      const course = await curateCourse(BEGINNER_PROFILE);
      expect(course.modules.length).toBeLessThanOrEqual(5);
    });

    it('sets skill_level to "beginner"', async () => {
      const course = await curateCourse(BEGINNER_PROFILE);
      expect(course.skill_level).toBe('beginner');
    });

    it('generates correct title', async () => {
      const course = await curateCourse(BEGINNER_PROFILE);
      expect(course.title).toBe('Personalized AI Learning Path for Priya Sharma');
    });

    it('includes Python Fundamentals as first module (beginner foundation)', async () => {
      const course = await curateCourse(BEGINNER_PROFILE);
      expect(course.modules[0].title).toBe('Python Programming Fundamentals');
    });

    it('includes Intro to AI as second module', async () => {
      const course = await curateCourse(BEGINNER_PROFILE);
      expect(course.modules[1].title).toBe('Introduction to AI & Machine Learning');
    });

    it('includes AI Agents module (always included)', async () => {
      const course = await curateCourse(BEGINNER_PROFILE);
      const agentModule = course.modules.find((m) =>
        m.title.toLowerCase().includes('agent'),
      );
      expect(agentModule).toBeDefined();
    });

    it('maps learner profile correctly', async () => {
      const course = await curateCourse(BEGINNER_PROFILE);
      expect(course.learner).toEqual({
        name: 'Priya Sharma',
        goal: 'Get a job in AI, Build AI-powered apps',
        prior_knowledge: ['python'],
        weak_areas: [],
        available_hours_per_week: 8,
        preferred_language: 'hi',
        level: 'beginner',
        learning_style: 'hands_on',
        deadline: '2026-09-01',
        education_background: 'B.Tech CS 3rd year',
      });
    });

    it('includes hands_on tip for hands_on learning style', async () => {
      const course = await curateCourse(BEGINNER_PROFILE);
      expect(course.tips).toContain(
        'Focus on the project modules — you learn best by building.',
      );
    });

    it('includes agents tip since agents is in specificInterests', async () => {
      const course = await curateCourse(BEGINNER_PROFILE);
      expect(course.tips).toContain(
        "AI Agents are the focus of this platform — you'll build multiple agent projects.",
      );
    });

    it('includes beginner tip', async () => {
      const course = await curateCourse(BEGINNER_PROFILE);
      expect(course.tips).toContain(
        "Don't rush — understanding foundations will make advanced topics much easier.",
      );
    });

    it('starts with empty completed_modules', async () => {
      const course = await curateCourse(BEGINNER_PROFILE);
      expect(course.completed_modules).toEqual([]);
    });

    it('has all free courses in matched_courses', async () => {
      const course = await curateCourse(BEGINNER_PROFILE);
      for (const c of course.matched_courses) {
        expect(c.free).toBe(true);
      }
    });

    it('has no duplicate courses by URL', async () => {
      const course = await curateCourse(BEGINNER_PROFILE);
      const urls = course.matched_courses.map((c) => c.url);
      expect(new Set(urls).size).toBe(urls.length);
    });
  });

  // --- Payload 2: Advanced Profile ---

  describe('advanced profile (Rahul Verma)', () => {
    it('allows up to 8 modules (availableHoursPerWeek=15 >= 10)', async () => {
      const course = await curateCourse(ADVANCED_PROFILE);
      expect(course.modules.length).toBeLessThanOrEqual(8);
    });

    it('sets skill_level to "advanced"', async () => {
      const course = await curateCourse(ADVANCED_PROFILE);
      expect(course.skill_level).toBe('advanced');
    });

    it('does NOT include Python Fundamentals (advanced skips foundations)', async () => {
      const course = await curateCourse(ADVANCED_PROFILE);
      const pythonModule = course.modules.find((m) =>
        m.title === 'Python Programming Fundamentals',
      );
      expect(pythonModule).toBeUndefined();
    });

    it('does NOT include Intro to AI & ML', async () => {
      const course = await curateCourse(ADVANCED_PROFILE);
      const introModule = course.modules.find((m) =>
        m.title === 'Introduction to AI & Machine Learning',
      );
      expect(introModule).toBeUndefined();
    });

    it('does NOT include Data Handling with Python', async () => {
      const course = await curateCourse(ADVANCED_PROFILE);
      const dataModule = course.modules.find((m) =>
        m.title === 'Data Handling with Python',
      );
      expect(dataModule).toBeUndefined();
    });

    it('maps prior_knowledge with 6 entries (3 langs + 3 aiExperience)', async () => {
      const course = await curateCourse(ADVANCED_PROFILE);
      expect(course.learner.prior_knowledge).toEqual([
        'python',
        'javascript',
        'rust',
        'trained models',
        'deployed to production',
        'fine-tuning',
      ]);
    });

    it('sets deadline to "flexible" when not provided', async () => {
      const course = await curateCourse(ADVANCED_PROFILE);
      expect(course.learner.deadline).toBe('flexible');
    });

    it('does NOT include beginner tip', async () => {
      const course = await curateCourse(ADVANCED_PROFILE);
      expect(course.tips).not.toContain(
        "Don't rush — understanding foundations will make advanced topics much easier.",
      );
    });

    it('does NOT include hands_on tip (learningStyle=reading)', async () => {
      const course = await curateCourse(ADVANCED_PROFILE);
      expect(course.tips).not.toContain(
        'Focus on the project modules — you learn best by building.',
      );
    });
  });

  // --- Experience Level "none" ---

  describe('none experience profile', () => {
    it('sets weak_areas for experienceLevel "none"', async () => {
      const course = await curateCourse(NONE_EXPERIENCE_PROFILE);
      expect(course.learner.weak_areas).toEqual([
        'programming basics',
        'math fundamentals',
      ]);
    });

    it('sets level to "beginner" for experienceLevel "none"', async () => {
      const course = await curateCourse(NONE_EXPERIENCE_PROFILE);
      expect(course.learner.level).toBe('beginner');
      expect(course.skill_level).toBe('beginner');
    });
  });

  // --- All Interests ---

  describe('all interests profile', () => {
    it('caps modules at maxModules despite many interests', async () => {
      const course = await curateCourse(ALL_INTERESTS_PROFILE);
      // availableHoursPerWeek=20 >= 10 → maxModules=8
      expect(course.modules.length).toBeLessThanOrEqual(8);
    });
  });

  // --- Zero Hours ---

  describe('zero hours profile', () => {
    it('still produces a valid course', async () => {
      const course = await curateCourse(ZERO_HOURS_PROFILE);
      expect(course.status).toBe('ready');
      expect(course.modules.length).toBeGreaterThan(0);
    });

    it('includes low-hours tip', async () => {
      const course = await curateCourse(ZERO_HOURS_PROFILE);
      expect(course.tips).toContain(
        'With limited time, prioritize core modules and skip optional readings.',
      );
    });
  });

  // --- Module structure ---

  describe('module structure', () => {
    it('has sequential module_number starting at 1', async () => {
      const course = await curateCourse(BEGINNER_PROFILE);
      course.modules.forEach((m, i) => {
        expect(m.module_number).toBe(i + 1);
      });
    });

    it('first module has no prerequisites', async () => {
      const course = await curateCourse(BEGINNER_PROFILE);
      expect(course.modules[0].prerequisites).toEqual([]);
    });

    it('subsequent modules reference the previous module', async () => {
      const course = await curateCourse(BEGINNER_PROFILE);
      for (let i = 1; i < course.modules.length; i++) {
        expect(course.modules[i].prerequisites).toContain(
          `Module ${i}`,
        );
      }
    });

    it('each module has a duration string', async () => {
      const course = await curateCourse(BEGINNER_PROFILE);
      for (const m of course.modules) {
        expect(m.duration).toMatch(/\d+ weeks?/);
      }
    });
  });
});
