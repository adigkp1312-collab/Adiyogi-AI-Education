/**
 * Question Bank Service — Cloud Run
 *
 * Manages the question bank via Vertex AI Datastore.
 * Endpoints:
 *   GET  /questions           — Search questions (adaptive)
 *   POST /questions           — Add/update a question
 *   POST /questions/feedback  — Record question effectiveness
 *   POST /questions/seed      — Seed the question bank
 *   GET  /health              — Health check
 */

import express from 'express';
import cors from 'cors';
import { searchQuestions, upsertQuestion, batchImportQuestions } from '../../src/services/vertexDatastore';
import { getSeedQuestions } from '../../src/services/webCrawler';

const app = express();
const PORT = parseInt(process.env.PORT || '8080', 10);

app.use(cors());
app.use(express.json());

// --- Health Check ---
app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', service: 'question-bank', timestamp: new Date().toISOString() });
});

// --- Search Questions ---
app.get('/questions', async (req, res) => {
  try {
    const query = (req.query.q as string) || 'AI interview';
    const category = req.query.category as string | undefined;
    const limit = parseInt((req.query.limit as string) || '10', 10);

    let questions = await searchQuestions(query, category, limit);

    // Fallback to seed questions if Vertex is not configured
    if (questions.length === 0) {
      const seeds = getSeedQuestions();
      questions = category
        ? seeds.filter((q) => q.category === category).slice(0, limit)
        : seeds.slice(0, limit);
    }

    res.json({ questions, total: questions.length });
  } catch (error) {
    console.error('[Question Bank] Search error:', error);
    res.status(500).json({ error: 'Failed to search questions' });
  }
});

// --- Add/Update Question ---
app.post('/questions', async (req, res) => {
  try {
    const question = req.body;
    if (!question.id || !question.text) {
      res.status(400).json({ error: 'Question must have id and text' });
      return;
    }

    const success = await upsertQuestion(question);
    res.json({ success });
  } catch (error) {
    console.error('[Question Bank] Upsert error:', error);
    res.status(500).json({ error: 'Failed to save question' });
  }
});

// --- Record Feedback ---
app.post('/questions/feedback', (req, res) => {
  const { questionId, useful } = req.body;
  if (!questionId) {
    res.status(400).json({ error: 'questionId required' });
    return;
  }
  // In production, update effectiveness score in Vertex Datastore
  res.json({ success: true, questionId, useful });
});

// --- Seed Question Bank ---
app.post('/questions/seed', async (req, res) => {
  try {
    const seeds = getSeedQuestions();
    const imported = await batchImportQuestions(seeds);
    res.json({
      success: true,
      imported,
      total: seeds.length,
      message: `Seeded ${imported} questions into datastore`,
    });
  } catch (error) {
    console.error('[Question Bank] Seed error:', error);
    res.status(500).json({ error: 'Failed to seed question bank' });
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`[Question Bank Service] Running on port ${PORT}`);
});
