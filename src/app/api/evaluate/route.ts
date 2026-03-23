import { NextRequest, NextResponse } from 'next/server';
import { evaluationEngine } from '@/services/evaluationEngine';
import { adaptCourse, getNextRecommendation } from '@/services/adaptiveLearning';
import type { EvaluationData } from '@/services/evaluationEngine';
import type { CourseJSON } from '@/types';
import { checkRateLimit, sanitizeText, apiError, safeError, getSessionUserId } from '@/lib/api-utils';
import { profileBuilder } from '@/services/profileBuilder';

const VALID_ACTIONS = ['update_progress', 'check_in', 'adapt', 'recommend'] as const;
type ValidAction = (typeof VALID_ACTIONS)[number];

const VALID_MOODS = ['great', 'good', 'okay', 'struggling', 'frustrated'] as const;

export async function POST(request: NextRequest) {
  const rateLimited = checkRateLimit(request);
  if (rateLimited) return rateLimited;

  try {
    const sessionUserId = await getSessionUserId(request);
    if (!sessionUserId) {
      return apiError('Authentication required', 401);
    }

    const body = await request.json();
    const { action, evaluation, course, data } = body as {
      action: string;
      evaluation: EvaluationData;
      course?: CourseJSON;
      data?: Record<string, unknown>;
    };

    if (!action || !VALID_ACTIONS.includes(action as ValidAction)) {
      return apiError(`Invalid action. Must be one of: ${VALID_ACTIONS.join(', ')}`, 400);
    }

    if (!evaluation || !evaluation.courseId) {
      return apiError('Valid evaluation data with courseId is required', 400);
    }

    // Use authenticated session userId — ignore any userId in the body
    evaluation.userId = sessionUserId;

    switch (action as ValidAction) {
      case 'update_progress': {
        const moduleNumber = data?.moduleNumber;
        if (typeof moduleNumber !== 'number' || moduleNumber < 1) {
          return apiError('moduleNumber (positive integer) is required for progress update', 400);
        }
        const { moduleNumber: _, ...update } = data || {};
        const updated = evaluationEngine.updateModuleProgress(
          evaluation,
          moduleNumber,
          update as Record<string, unknown>,
        );

        // Emit profile signals (fire-and-forget)
        const moduleEval = updated.moduleEvaluations.find((m) => m.moduleNumber === moduleNumber);
        if (moduleEval?.status === 'completed') {
          profileBuilder.ingestSignal(
            profileBuilder.createSignal(sessionUserId, 'module_completed', {
              completedModules: updated.overallProgress.completedModules,
              totalModules: updated.overallProgress.totalModules,
            }, evaluation.courseId, moduleNumber),
          ).catch(() => {});
        }
        if (moduleEval?.quizScore !== undefined) {
          const topic = data?.topic as string || `module_${moduleNumber}`;
          profileBuilder.ingestSignal(
            profileBuilder.createSignal(sessionUserId, 'quiz_score', {
              score: moduleEval.quizScore,
              topic,
              quizCount: updated.overallProgress.completedModules,
            }, evaluation.courseId, moduleNumber),
          ).catch(() => {});
        }
        if (moduleEval?.timeSpentMinutes) {
          profileBuilder.ingestSignal(
            profileBuilder.createSignal(sessionUserId, 'time_spent', {
              minutes: moduleEval.timeSpentMinutes,
            }, evaluation.courseId, moduleNumber),
          ).catch(() => {});
        }

        return NextResponse.json({ evaluation: updated });
      }

      case 'check_in': {
        const mood = data?.mood;
        if (!mood || !VALID_MOODS.includes(mood as typeof VALID_MOODS[number])) {
          return apiError(`mood is required and must be one of: ${VALID_MOODS.join(', ')}`, 400);
        }
        const confusingTopics = Array.isArray(data?.confusingTopics)
          ? (data.confusingTopics as string[]).slice(0, 20).map((t) => sanitizeText(String(t), 200))
          : [];
        const feedbackText = typeof data?.feedbackText === 'string'
          ? sanitizeText(data.feedbackText, 1000)
          : undefined;
        const result = evaluationEngine.recordCheckIn(
          evaluation,
          mood as 'great' | 'good' | 'okay' | 'struggling' | 'frustrated',
          confusingTopics,
          feedbackText,
        );

        // Emit check_in signal (fire-and-forget)
        profileBuilder.ingestSignal(
          profileBuilder.createSignal(sessionUserId, 'check_in', {
            mood,
            confusingTopics,
          }, evaluation.courseId),
        ).catch(() => {});

        return NextResponse.json(result);
      }

      case 'adapt': {
        if (!course) {
          return apiError('course is required for adaptation', 400);
        }
        const result = adaptCourse(course, evaluation);
        return NextResponse.json(result);
      }

      case 'recommend': {
        if (!course) {
          return apiError('course is required for recommendation', 400);
        }
        const recommendation = getNextRecommendation(course, evaluation);
        return NextResponse.json(recommendation);
      }
    }
  } catch (error) {
    return apiError(safeError(error));
  }
}
