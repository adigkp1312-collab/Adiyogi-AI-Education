import { NextRequest, NextResponse } from "next/server";
import { profileBuilder } from "@/services/profileBuilder";
import { checkRateLimit, apiError, safeError, getSessionUserId, isValidId } from "@/lib/api-utils";
import type { SignalType } from "@/types/profile";

export const dynamic = "force-dynamic";

const VALID_SIGNAL_TYPES: SignalType[] = [
  'module_completed',
  'quiz_score',
  'time_spent',
  'check_in',
  'content_preference',
  'resource_skipped',
  'course_started',
  'course_completed',
  'goal_updated',
];

/**
 * POST /api/profile/signal — Ingest a behavioral signal to update the profile.
 * Body: { type: SignalType, payload: object, courseId?: string, moduleNumber?: number }
 */
export async function POST(request: NextRequest) {
  const rateLimited = checkRateLimit(request);
  if (rateLimited) return rateLimited;

  try {
    const userId = await getSessionUserId(request);
    if (!userId) {
      return apiError("Authentication required", 401);
    }

    const body = await request.json();
    const { type, payload, courseId, moduleNumber } = body;

    if (!type || !VALID_SIGNAL_TYPES.includes(type)) {
      return apiError(`Invalid signal type. Must be one of: ${VALID_SIGNAL_TYPES.join(', ')}`, 400);
    }

    if (!payload || typeof payload !== 'object') {
      return apiError("payload is required and must be an object", 400);
    }

    if (courseId && !isValidId(courseId)) {
      return apiError("Invalid courseId format", 400);
    }

    const signal = profileBuilder.createSignal(
      userId,
      type as SignalType,
      payload,
      courseId,
      moduleNumber,
    );

    const updatedProfile = await profileBuilder.ingestSignal(signal);
    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error) {
    return apiError(safeError(error));
  }
}
