import { NextRequest, NextResponse } from 'next/server';
import { searchQuestions } from '@/services/vertexDatastore';
import { getSeedQuestions, searchKnownCourses } from '@/services/webCrawler';
import type { StoredQuestion } from '@/types/interview';

/**
 * GET /api/questions
 * Returns adaptive questions from the question bank.
 * Falls back to seed questions if Vertex Datastore is not configured.
 *
 * Query params:
 * - category: filter by category (background, goals, skills, preferences, availability)
 * - context: JSON-encoded previous answers for adaptive selection
 * - limit: max results (default 5)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const limit = parseInt(searchParams.get('limit') || '5', 10);
  const contextParam = searchParams.get('context');

  try {
    // Try Vertex Datastore first
    let questions = await searchQuestions('AI interview question', category, limit);

    // Fallback to seed questions if Vertex is not configured
    if (questions.length === 0) {
      const seeds = getSeedQuestions();
      questions = category
        ? seeds.filter((q) => q.category === category).slice(0, limit)
        : seeds.slice(0, limit);
    }

    // If context provided, apply adaptive filtering
    if (contextParam) {
      try {
        const context = JSON.parse(contextParam) as Record<string, string>;
        questions = applyAdaptiveFiltering(questions, context);
      } catch {
        // Ignore invalid context
      }
    }

    return NextResponse.json({
      questions,
      total: questions.length,
      source: questions.length > 0 && questions[0].source === 'seed' ? 'seed' : 'datastore',
    });
  } catch (error) {
    console.error('[Questions API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 },
    );
  }
}

/**
 * POST /api/questions/feedback
 * Record question effectiveness from user interview sessions.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { questionId, useful } = body as { questionId: string; useful: boolean };

    if (!questionId) {
      return NextResponse.json(
        { error: 'questionId is required' },
        { status: 400 },
      );
    }

    // In production, update effectiveness score in Vertex Datastore
    return NextResponse.json({
      success: true,
      message: `Feedback recorded for question ${questionId}: ${useful ? 'useful' : 'not useful'}`,
    });
  } catch (error) {
    console.error('[Questions API] Feedback error:', error);
    return NextResponse.json(
      { error: 'Failed to record feedback' },
      { status: 500 },
    );
  }
}

// --- Adaptive Filtering ---

function applyAdaptiveFiltering(
  questions: StoredQuestion[],
  context: Record<string, string>,
): StoredQuestion[] {
  // Sort by effectiveness score (higher is better)
  const sorted = [...questions].sort(
    (a, b) => b.effectivenessScore - a.effectivenessScore,
  );

  // If user is a beginner, prioritize beginner-friendly questions
  if (context.experience === 'none' || context.experience === 'beginner') {
    return sorted.filter(
      (q) => !q.tags.includes('advanced') && !q.tags.includes('deployment'),
    );
  }

  // If user is advanced, skip basic questions
  if (context.experience === 'advanced') {
    return sorted.filter(
      (q) => !q.tags.includes('basic') && !q.tags.includes('prerequisites'),
    );
  }

  return sorted;
}
