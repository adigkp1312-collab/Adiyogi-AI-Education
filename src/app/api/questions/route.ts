import { NextRequest, NextResponse } from 'next/server';
import { searchQuestions } from '@/services/vertexDatastore';
import { getSeedQuestions } from '@/services/webCrawler';
import type { StoredQuestion } from '@/types/interview';
import { checkRateLimit, sanitizeText, apiError, safeError } from '@/lib/api-utils';

const MAX_QUESTION_LIMIT = 50;
const VALID_CATEGORIES = ['ai', 'ml', 'deep-learning', 'nlp', 'computer-vision', 'data-science', 'general'] as const;

/**
 * GET /api/questions
 * Returns adaptive questions from the question bank.
 */
export async function GET(request: NextRequest) {
  const rateLimited = checkRateLimit(request);
  if (rateLimited) return rateLimited;

  const { searchParams } = new URL(request.url);
  const rawCategory = searchParams.get('category');
  const category = rawCategory && VALID_CATEGORIES.includes(rawCategory as typeof VALID_CATEGORIES[number])
    ? rawCategory
    : undefined;
  const rawLimit = parseInt(searchParams.get('limit') || '5', 10);
  const limit = Math.max(1, Math.min(MAX_QUESTION_LIMIT, isNaN(rawLimit) ? 5 : rawLimit));
  const contextParam = searchParams.get('context');

  try {
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
        if (context && typeof context === 'object') {
          questions = applyAdaptiveFiltering(questions, context);
        }
      } catch {
        // Invalid JSON context — continue with unfiltered questions
        console.warn('[Questions API] Invalid context JSON, skipping adaptive filtering');
      }
    }

    return NextResponse.json({
      questions,
      total: questions.length,
      source: questions.length > 0 && questions[0].source === 'seed' ? 'seed' : 'datastore',
    });
  } catch (error) {
    return apiError(safeError(error));
  }
}

/**
 * POST /api/questions/feedback
 */
export async function POST(request: NextRequest) {
  const rateLimited = checkRateLimit(request);
  if (rateLimited) return rateLimited;

  try {
    const body = await request.json();
    const { questionId, useful } = body as { questionId: string; useful: boolean };

    if (!questionId || typeof questionId !== 'string') {
      return apiError('questionId is required', 400);
    }

    if (typeof useful !== 'boolean') {
      return apiError('useful (boolean) is required', 400);
    }

    // TODO: Persist feedback to DynamoDB when question feedback table is ready
    console.log(`[Questions] Feedback for ${questionId}: ${useful ? 'useful' : 'not useful'}`);

    return NextResponse.json({
      success: true,
      persisted: false,
      message: `Feedback received for question ${questionId} (persistence not yet implemented)`,
    });
  } catch (error) {
    return apiError(safeError(error));
  }
}

// --- Adaptive Filtering ---

function applyAdaptiveFiltering(
  questions: StoredQuestion[],
  context: Record<string, string>,
): StoredQuestion[] {
  const sorted = [...questions].sort(
    (a, b) => b.effectivenessScore - a.effectivenessScore,
  );

  const experience = context.experience;
  if (experience === 'none' || experience === 'beginner') {
    return sorted.filter(
      (q) => !q.tags.includes('advanced') && !q.tags.includes('deployment'),
    );
  }

  if (experience === 'advanced') {
    return sorted.filter(
      (q) => !q.tags.includes('basic') && !q.tags.includes('prerequisites'),
    );
  }

  return sorted;
}
