import { describe, it, expect, vi } from 'vitest';

vi.mock('@/services/vertexDatastore', () => ({
  searchCourseIndex: vi.fn().mockResolvedValue([]),
  searchQuestions: vi.fn().mockResolvedValue([]),
}));

import { curateCourse } from '@/services/curatorService';
import {
  ZERO_HOURS_PROFILE,
  ALL_INTERESTS_PROFILE,
  NONE_EXPERIENCE_PROFILE,
  ADVANCED_PROFILE,
} from '../fixtures/profiles';
import type { InterviewProfile } from '../../types/interview';

describe('E2E: Edge Cases', () => {
  // --- Zero available hours ---

  describe('user with 0 available hours per week', () => {
    it('still produces a valid course', async () => {
      const course = await curateCourse(ZERO_HOURS_PROFILE);
      expect(course.status).toBe('ready');
      expect(course.modules.length).toBeGreaterThan(0);
    });

    it('sets available_hours_per_week to 0 in learner profile', async () => {
      const course = await curateCourse(ZERO_HOURS_PROFILE);
      expect(course.learner.available_hours_per_week).toBe(0);
    });

    it('limits modules to 5 (0 < 10 hours)', async () => {
      const course = await curateCourse(ZERO_HOURS_PROFILE);
      expect(course.modules.length).toBeLessThanOrEqual(5);
    });

    it('includes low-hours tip', async () => {
      const course = await curateCourse(ZERO_HOURS_PROFILE);
      expect(course.tips).toContain(
        'With limited time, prioritize core modules and skip optional readings.',
      );
    });
  });

  // --- All interests selected ---

  describe('user with all 8 interests selected', () => {
    it('caps at maxModules (8 for 20hrs/week)', async () => {
      const course = await curateCourse(ALL_INTERESTS_PROFILE);
      expect(course.modules.length).toBeLessThanOrEqual(8);
    });

    it('does not crash or produce empty course', async () => {
      const course = await curateCourse(ALL_INTERESTS_PROFILE);
      expect(course.status).toBe('ready');
      expect(course.modules.length).toBeGreaterThan(0);
    });

    it('includes agents module (platform focus)', async () => {
      const course = await curateCourse(ALL_INTERESTS_PROFILE);
      const agentModule = course.modules.find((m) =>
        m.title.toLowerCase().includes('agent'),
      );
      expect(agentModule).toBeDefined();
    });
  });

  // --- Experience level "none" ---

  describe('user with experienceLevel "none"', () => {
    it('sets weak_areas to programming basics and math', async () => {
      const course = await curateCourse(NONE_EXPERIENCE_PROFILE);
      expect(course.learner.weak_areas).toEqual([
        'programming basics',
        'math fundamentals',
      ]);
    });

    it('maps level to "beginner"', async () => {
      const course = await curateCourse(NONE_EXPERIENCE_PROFILE);
      expect(course.learner.level).toBe('beginner');
      expect(course.skill_level).toBe('beginner');
    });

    it('includes Python Fundamentals as first module', async () => {
      const course = await curateCourse(NONE_EXPERIENCE_PROFILE);
      expect(course.modules[0].title).toBe('Python Programming Fundamentals');
    });

    it('includes Intro to AI module', async () => {
      const course = await curateCourse(NONE_EXPERIENCE_PROFILE);
      const intro = course.modules.find((m) =>
        m.title.includes('Introduction to AI'),
      );
      expect(intro).toBeDefined();
    });
  });

  // --- Advanced with no programming languages ---

  describe('advanced user with empty programmingLanguages', () => {
    const advancedNoPL: InterviewProfile = {
      ...ADVANCED_PROFILE,
      programmingLanguages: [],
      name: 'Advanced NoPL',
    };

    it('does NOT add foundation modules', async () => {
      const course = await curateCourse(advancedNoPL);
      const titles = course.modules.map((m) => m.title);
      expect(titles).not.toContain('Python Programming Fundamentals');
      expect(titles).not.toContain('Introduction to AI & Machine Learning');
      expect(titles).not.toContain('Data Handling with Python');
    });

    it('has empty prior_knowledge for programming languages', async () => {
      const course = await curateCourse(advancedNoPL);
      // prior_knowledge = [...programmingLanguages, ...aiExperience]
      // programmingLanguages is empty, so it's just aiExperience
      expect(course.learner.prior_knowledge).toEqual([
        'trained models',
        'deployed to production',
        'fine-tuning',
      ]);
    });
  });

  // --- Single interest ---

  describe('user with single interest', () => {
    it('still includes agents module (always added)', async () => {
      const singleInterest: InterviewProfile = {
        ...NONE_EXPERIENCE_PROFILE,
        specificInterests: ['rag'], // no agents
      };
      const course = await curateCourse(singleInterest);
      const agentModule = course.modules.find((m) =>
        m.title.toLowerCase().includes('agent'),
      );
      expect(agentModule).toBeDefined();
    });
  });

  // --- Duplicate interest with agents ---

  describe('user who already has agents in interests', () => {
    it('does not duplicate the agents module', async () => {
      const withAgents: InterviewProfile = {
        ...NONE_EXPERIENCE_PROFILE,
        specificInterests: ['agents'],
      };
      const course = await curateCourse(withAgents);
      const agentModules = course.modules.filter((m) =>
        m.title.toLowerCase().includes('agent') &&
        m.title.includes('Architecture'),
      );
      expect(agentModules.length).toBe(1);
    });
  });
});
