import { NextRequest, NextResponse } from 'next/server';
import { aiInterviewService, type AIInterviewSession } from '@/services/aiInterviewService';
import { profileBuilder } from '@/services/profileBuilder';
import { checkRateLimit, apiError, safeError, getSessionUserId, isValidLanguage, sanitizeText } from '@/lib/api-utils';
import type { SupportedLanguage } from '@/types';

export const dynamic = 'force-dynamic';

// In-memory session store (replace with Redis/DynamoDB for production)
const sessions = new Map<string, AIInterviewSession>();

/**
 * POST /api/interview — Start or continue an AI interview.
 *
 * Start: { action: "start", language?: "en" }
 * Respond: { action: "respond", sessionId: "...", message: "..." }
 */
export async function POST(request: NextRequest) {
  const rateLimited = checkRateLimit(request, 20);
  if (rateLimited) return rateLimited;

  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'start') {
      const language: SupportedLanguage = isValidLanguage(body.language) ? body.language : 'en';
      const userId = await getSessionUserId(request) || undefined;

      const { session, turn } = await aiInterviewService.startSession(language, userId);
      sessions.set(session.id, session);

      return NextResponse.json({
        sessionId: session.id,
        message: turn.aiMessage,
        isComplete: turn.isComplete,
        progress: turn.progress,
      }, { status: 201 });
    }

    if (action === 'respond') {
      const { sessionId, message } = body;

      if (!sessionId || typeof sessionId !== 'string') {
        return apiError('sessionId is required', 400);
      }

      if (!message || typeof message !== 'string' || !message.trim()) {
        return apiError('message is required', 400);
      }

      const session = sessions.get(sessionId);
      if (!session) {
        return apiError('Session not found or expired', 404);
      }

      if (session.status !== 'active') {
        return apiError('Session is already completed', 400);
      }

      const sanitizedMessage = sanitizeText(message, 2000);
      const { session: updatedSession, turn } = await aiInterviewService.respondToSession(session, sanitizedMessage);

      sessions.set(sessionId, updatedSession);

      // If interview is complete, create the profile
      if (turn.isComplete && turn.profile) {
        const userId = await getSessionUserId(request);
        if (userId) {
          try {
            const existing = await profileBuilder.getProfile(userId);
            if (!existing) {
              await profileBuilder.initializeFromInterview(userId, turn.profile);
            }
          } catch {
            // Profile creation is best-effort during interview
          }
        }

        // Clean up session after a delay
        setTimeout(() => sessions.delete(sessionId), 5 * 60 * 1000);
      }

      return NextResponse.json({
        sessionId,
        message: turn.aiMessage,
        isComplete: turn.isComplete,
        progress: turn.progress,
        profile: turn.isComplete ? turn.profile : undefined,
      });
    }

    return apiError('Invalid action. Use "start" or "respond"', 400);
  } catch (error) {
    return apiError(safeError(error));
  }
}
