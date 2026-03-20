/**
 * Interviewer Service — Cloud Run
 *
 * Handles adaptive interviews, question flow, and profile generation.
 * Endpoints:
 *   POST /interview/start    — Create a new interview session
 *   POST /interview/answer   — Submit an answer, get next question
 *   GET  /interview/:id      — Get session state
 *   GET  /health             — Health check
 */

import express from 'express';
import cors from 'cors';
import { InterviewerService } from '../../src/services/interviewerService';
import type { SupportedLanguage } from '../../src/types';

const app = express();
const PORT = parseInt(process.env.PORT || '8080', 10);

app.use(cors());
app.use(express.json());

const interviewer = new InterviewerService();

// In-memory session store (replace with Firestore in production)
const sessions = new Map<string, any>();

// --- Health Check ---
app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', service: 'interviewer', timestamp: new Date().toISOString() });
});

// --- Start Interview ---
app.post('/interview/start', (req, res) => {
  const { language = 'en', mode = 'typeform' } = req.body;
  const session = interviewer.createSession(language as SupportedLanguage, mode);
  const firstQuestion = interviewer.getNextQuestion(session);

  sessions.set(session.id, session);

  res.json({
    session: {
      id: session.id,
      status: session.status,
      language: session.language,
      progress: interviewer.getProgress(session),
    },
    nextQuestion: firstQuestion,
  });
});

// --- Submit Answer ---
app.post('/interview/answer', (req, res) => {
  const { sessionId, questionId, answer } = req.body;

  if (!sessionId || !questionId) {
    res.status(400).json({ error: 'sessionId and questionId required' });
    return;
  }

  const session = sessions.get(sessionId);
  if (!session) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }

  const updated = interviewer.recordResponse(session, questionId, answer);
  sessions.set(sessionId, updated);

  const nextQuestion = updated.status === 'completed' ? null : interviewer.getNextQuestion(updated);

  res.json({
    session: {
      id: updated.id,
      status: updated.status,
      language: updated.language,
      progress: interviewer.getProgress(updated),
    },
    nextQuestion,
    profile: updated.status === 'completed' ? updated.generatedProfile : null,
  });
});

// --- Get Session ---
app.get('/interview/:id', (req, res) => {
  const session = sessions.get(req.params.id);
  if (!session) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }

  res.json({
    session: {
      id: session.id,
      status: session.status,
      language: session.language,
      progress: interviewer.getProgress(session),
      responses: session.responses.length,
    },
    profile: session.generatedProfile || null,
  });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`[Interviewer Service] Running on port ${PORT}`);
});
