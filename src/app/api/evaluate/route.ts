import { NextRequest, NextResponse } from 'next/server';
import { evaluationEngine } from '@/services/evaluationEngine';
import { adaptCourse, getNextRecommendation } from '@/services/adaptiveLearning';
import type { EvaluationData } from '@/services/evaluationEngine';

/**
 * POST /api/evaluate
 * Submit progress data and receive adapted course updates.
 *
 * Actions:
 * - "update_progress": Update module progress
 * - "check_in": Record a check-in
 * - "adapt": Run adaptation algorithm
 * - "recommend": Get next recommended action
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, evaluation, course, data } = body as {
      action: string;
      evaluation: EvaluationData;
      course?: any;
      data?: any;
    };

    if (!evaluation) {
      return NextResponse.json(
        { error: 'evaluation data is required' },
        { status: 400 },
      );
    }

    switch (action) {
      case 'update_progress': {
        const { moduleNumber, ...update } = data || {};
        if (!moduleNumber) {
          return NextResponse.json(
            { error: 'moduleNumber is required for progress update' },
            { status: 400 },
          );
        }
        const updated = evaluationEngine.updateModuleProgress(
          evaluation,
          moduleNumber,
          update,
        );
        return NextResponse.json({ evaluation: updated });
      }

      case 'check_in': {
        const { mood, confusingTopics, feedbackText } = data || {};
        if (!mood) {
          return NextResponse.json(
            { error: 'mood is required for check-in' },
            { status: 400 },
          );
        }
        const result = evaluationEngine.recordCheckIn(
          evaluation,
          mood,
          confusingTopics || [],
          feedbackText,
        );
        return NextResponse.json(result);
      }

      case 'adapt': {
        if (!course) {
          return NextResponse.json(
            { error: 'course is required for adaptation' },
            { status: 400 },
          );
        }
        const result = adaptCourse(course, evaluation);
        return NextResponse.json(result);
      }

      case 'recommend': {
        if (!course) {
          return NextResponse.json(
            { error: 'course is required for recommendation' },
            { status: 400 },
          );
        }
        const recommendation = getNextRecommendation(course, evaluation);
        return NextResponse.json(recommendation);
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error('[Evaluate API] Error:', error);
    return NextResponse.json(
      { error: 'Evaluation failed' },
      { status: 500 },
    );
  }
}
