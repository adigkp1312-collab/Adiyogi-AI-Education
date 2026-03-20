/**
 * Evaluation Service — Cloud Run
 *
 * Tracks progress, conducts check-ins, adapts courses.
 * Endpoints:
 *   POST /evaluate/init         — Initialize evaluation for a course
 *   POST /evaluate/progress     — Update module progress
 *   POST /evaluate/checkin      — Record a check-in
 *   POST /evaluate/adapt        — Run adaptation algorithm
 *   POST /evaluate/recommend    — Get next recommended action
 *   GET  /evaluate/:userId/:courseId — Get evaluation state
 *   GET  /health                — Health check
 */

import express from 'express';
import cors from 'cors';
import { EvaluationEngine } from '../../src/services/evaluationEngine';
import { adaptCourse, getNextRecommendation } from '../../src/services/adaptiveLearning';
import type { EvaluationData } from '../../src/services/evaluationEngine';

const app = express();
const PORT = parseInt(process.env.PORT || '8080', 10);

app.use(cors());
app.use(express.json());

const engine = new EvaluationEngine();

// In-memory store (replace with Firestore in production)
const evaluations = new Map<string, EvaluationData>();

function evalKey(userId: string, courseId: string): string {
  return `${userId}:${courseId}`;
}

// --- Health Check ---
app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', service: 'evaluation', timestamp: new Date().toISOString() });
});

// --- Initialize Evaluation ---
app.post('/evaluate/init', (req, res) => {
  const { userId, course } = req.body;
  if (!userId || !course) {
    res.status(400).json({ error: 'userId and course required' });
    return;
  }

  const evaluation = engine.createEvaluation(userId, course);
  evaluations.set(evalKey(userId, course.id), evaluation);

  res.json({ evaluation });
});

// --- Update Module Progress ---
app.post('/evaluate/progress', (req, res) => {
  const { userId, courseId, moduleNumber, ...update } = req.body;
  if (!userId || !courseId || !moduleNumber) {
    res.status(400).json({ error: 'userId, courseId, and moduleNumber required' });
    return;
  }

  const key = evalKey(userId, courseId);
  const evaluation = evaluations.get(key);
  if (!evaluation) {
    res.status(404).json({ error: 'Evaluation not found. Call /evaluate/init first.' });
    return;
  }

  const updated = engine.updateModuleProgress(evaluation, moduleNumber, update);
  evaluations.set(key, updated);

  res.json({ evaluation: updated });
});

// --- Check-In ---
app.post('/evaluate/checkin', (req, res) => {
  const { userId, courseId, mood, confusingTopics = [], feedbackText } = req.body;
  if (!userId || !courseId || !mood) {
    res.status(400).json({ error: 'userId, courseId, and mood required' });
    return;
  }

  const key = evalKey(userId, courseId);
  const evaluation = evaluations.get(key);
  if (!evaluation) {
    res.status(404).json({ error: 'Evaluation not found' });
    return;
  }

  const result = engine.recordCheckIn(evaluation, mood, confusingTopics, feedbackText);
  evaluations.set(key, result.evaluation);

  res.json(result);
});

// --- Run Adaptation ---
app.post('/evaluate/adapt', (req, res) => {
  const { userId, courseId, course } = req.body;
  if (!userId || !courseId || !course) {
    res.status(400).json({ error: 'userId, courseId, and course required' });
    return;
  }

  const key = evalKey(userId, courseId);
  const evaluation = evaluations.get(key);
  if (!evaluation) {
    res.status(404).json({ error: 'Evaluation not found' });
    return;
  }

  const result = adaptCourse(course, evaluation);
  res.json(result);
});

// --- Get Recommendation ---
app.post('/evaluate/recommend', (req, res) => {
  const { userId, courseId, course } = req.body;
  if (!userId || !courseId || !course) {
    res.status(400).json({ error: 'userId, courseId, and course required' });
    return;
  }

  const key = evalKey(userId, courseId);
  const evaluation = evaluations.get(key);
  if (!evaluation) {
    res.status(404).json({ error: 'Evaluation not found' });
    return;
  }

  const recommendation = getNextRecommendation(course, evaluation);
  res.json(recommendation);
});

// --- Get Evaluation State ---
app.get('/evaluate/:userId/:courseId', (req, res) => {
  const key = evalKey(req.params.userId, req.params.courseId);
  const evaluation = evaluations.get(key);
  if (!evaluation) {
    res.status(404).json({ error: 'Evaluation not found' });
    return;
  }
  res.json({ evaluation });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`[Evaluation Service] Running on port ${PORT}`);
});
