import { describe, it, expect } from 'vitest';
import {
  generateHandsOnPlan,
  getAllProjects,
  getProjectById,
  getFreeTierTools,
} from '@/services/handsOnPlanner';

describe('handsOnPlanner', () => {
  // --- Payload 12: generateHandsOnPlan("AI agents", "beginner") ---

  describe('generateHandsOnPlan("AI agents", "beginner")', () => {
    const projects = generateHandsOnPlan('AI agents', 'beginner');

    it('returns multiple projects', () => {
      expect(projects.length).toBeGreaterThanOrEqual(2);
    });

    it('includes agent or chatbot project matching the topic', () => {
      // "AI agents" matches agent project by tag; chatbot may not match
      // since its tags don't include "agents" — only "chatbot"
      const agentOrChatbot = projects.find(
        (p) => p.id === 'project-ai-agent' || p.id === 'project-chatbot-basic',
      );
      expect(agentOrChatbot).toBeDefined();
    });

    it('includes multi-tool agent project (tags match "agents")', () => {
      const agent = projects.find((p) => p.id === 'project-ai-agent');
      expect(agent).toBeDefined();
      expect(agent!.tags).toContain('agents');
    });

    it('includes capstone project (always included via "capstone" tag)', () => {
      const capstone = projects.find((p) => p.id === 'project-capstone-deploy');
      expect(capstone).toBeDefined();
    });

    it('excludes advanced-level projects for beginners', () => {
      const advanced = projects.filter((p) => p.level === 'advanced');
      expect(advanced).toHaveLength(0);
    });

    it('does NOT include fine-tuning project (level=advanced)', () => {
      const fineTune = projects.find((p) => p.id === 'project-fine-tune');
      expect(fineTune).toBeUndefined();
    });
  });

  // --- Level filtering ---

  describe('generateHandsOnPlan("chatbot", "advanced")', () => {
    const projects = generateHandsOnPlan('chatbot', 'advanced');

    it('includes beginner-level project for advanced users', () => {
      const chatbot = projects.find((p) => p.id === 'project-chatbot-basic');
      expect(chatbot).toBeDefined();
    });
  });

  describe('generateHandsOnPlan("agents", "intermediate")', () => {
    const projects = generateHandsOnPlan('agents', 'intermediate');

    it('excludes advanced-level projects', () => {
      const advanced = projects.filter((p) => p.level === 'advanced');
      expect(advanced).toHaveLength(0);
    });
  });

  // --- No topic match fallback ---

  describe('generateHandsOnPlan("quantum computing", "intermediate")', () => {
    const projects = generateHandsOnPlan('quantum computing', 'intermediate');

    it('returns level-appropriate projects as fallback', () => {
      expect(projects.length).toBeGreaterThan(0);
      for (const p of projects) {
        expect(['beginner', 'intermediate']).toContain(p.level);
      }
    });
  });

  // --- Project structure ---

  describe('project structure', () => {
    const allProjects = getAllProjects();

    it('all projects have ordered steps', () => {
      for (const project of allProjects) {
        for (let i = 0; i < project.steps.length; i++) {
          expect(project.steps[i].stepNumber).toBe(i + 1);
        }
      }
    });

    it('all tools have signupUrl', () => {
      for (const project of allProjects) {
        for (const tool of project.tools) {
          expect(tool.signupUrl).toBeDefined();
          expect(tool.signupUrl.length).toBeGreaterThan(0);
        }
      }
    });

    it('all projects have deliverables', () => {
      for (const project of allProjects) {
        expect(project.deliverables.length).toBeGreaterThan(0);
      }
    });

    it('all projects have tags', () => {
      for (const project of allProjects) {
        expect(project.tags.length).toBeGreaterThan(0);
      }
    });

    it('estimatedHours are reasonable (1-50)', () => {
      for (const project of allProjects) {
        expect(project.estimatedHours).toBeGreaterThanOrEqual(1);
        expect(project.estimatedHours).toBeLessThanOrEqual(50);
      }
    });
  });

  // --- Utility functions ---

  describe('getProjectById()', () => {
    it('returns project by ID', () => {
      const project = getProjectById('project-chatbot-basic');
      expect(project).toBeDefined();
      expect(project!.title).toBe('Build a Simple AI Chatbot');
    });

    it('returns undefined for unknown ID', () => {
      expect(getProjectById('nonexistent')).toBeUndefined();
    });
  });

  describe('getFreeTierTools()', () => {
    const tools = getFreeTierTools();

    it('returns all registered free tools', () => {
      expect(tools.length).toBeGreaterThanOrEqual(9);
    });

    it('includes GitHub', () => {
      const github = tools.find((t) => t.name === 'GitHub');
      expect(github).toBeDefined();
      expect(github!.signupUrl).toBe('https://github.com/signup');
    });
  });
});
