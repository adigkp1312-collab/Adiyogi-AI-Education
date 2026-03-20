/**
 * Curator Service — Cloud Run
 *
 * Generates personalized course plans from user profiles.
 * Endpoints:
 *   POST /curate             — Generate a course plan from profile
 *   GET  /courses             — Search indexed courses
 *   GET  /projects            — List hands-on project templates
 *   GET  /projects/:id        — Get a specific project
 *   GET  /tools               — List free-tier tools
 *   GET  /health              — Health check
 */

import express from 'express';
import cors from 'cors';
import { curateCourse } from '../../src/services/curatorService';
import { searchKnownCourses, getKnownCourses } from '../../src/services/webCrawler';
import { getAllProjects, getProjectById, getFreeTierTools } from '../../src/services/handsOnPlanner';

const app = express();
const PORT = parseInt(process.env.PORT || '8080', 10);

app.use(cors());
app.use(express.json());

// --- Health Check ---
app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', service: 'curator', timestamp: new Date().toISOString() });
});

// --- Generate Course Plan ---
app.post('/curate', async (req, res) => {
  try {
    const profile = req.body;

    if (!profile.name || !profile.goals || profile.goals.length === 0) {
      res.status(400).json({ error: 'Profile must include name and at least one goal' });
      return;
    }

    const course = await curateCourse(profile);

    res.json({
      course,
      message: `Personalized course created with ${course.modules.length} modules covering ${course.estimated_duration}.`,
    });
  } catch (error) {
    console.error('[Curator] Curate error:', error);
    res.status(500).json({ error: 'Failed to generate course plan' });
  }
});

// --- Search Courses ---
app.get('/courses', (req, res) => {
  const query = (req.query.q as string) || '';
  const level = req.query.level as string | undefined;

  if (!query) {
    res.json({ courses: getKnownCourses() });
    return;
  }

  const courses = searchKnownCourses(query, { level, free: true });
  res.json({ courses, total: courses.length });
});

// --- List Projects ---
app.get('/projects', (_req, res) => {
  res.json({ projects: getAllProjects() });
});

// --- Get Project ---
app.get('/projects/:id', (req, res) => {
  const project = getProjectById(req.params.id);
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }
  res.json({ project });
});

// --- List Free-Tier Tools ---
app.get('/tools', (_req, res) => {
  res.json({ tools: getFreeTierTools() });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`[Curator Service] Running on port ${PORT}`);
});
