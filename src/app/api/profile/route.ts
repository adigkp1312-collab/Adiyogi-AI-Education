import { NextRequest, NextResponse } from "next/server";
import { profileBuilder } from "@/services/profileBuilder";
import { checkRateLimit, apiError, safeError, getSessionUserId } from "@/lib/api-utils";
import type { InterviewProfile } from "@/types/interview";

export const dynamic = "force-dynamic";

/**
 * GET /api/profile — Get the current user's enriched profile.
 * Optional query: ?format=learner to get backward-compatible LearnerProfile.
 */
export async function GET(request: NextRequest) {
  const rateLimited = checkRateLimit(request);
  if (rateLimited) return rateLimited;

  try {
    const userId = await getSessionUserId(request);
    if (!userId) {
      return apiError("Authentication required", 401);
    }

    const profile = await profileBuilder.getProfile(userId);
    if (!profile) {
      return apiError("Profile not found", 404);
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format");

    if (format === "learner") {
      return NextResponse.json(profileBuilder.toLearnerProfile(profile));
    }

    if (format === "user") {
      return NextResponse.json(profileBuilder.toUserProfile(profile));
    }

    return NextResponse.json(profile);
  } catch (error) {
    return apiError(safeError(error));
  }
}

/**
 * POST /api/profile — Initialize profile from interview data.
 * Body: { interviewProfile: InterviewProfile }
 */
export async function POST(request: NextRequest) {
  const rateLimited = checkRateLimit(request, 10);
  if (rateLimited) return rateLimited;

  try {
    const userId = await getSessionUserId(request);
    if (!userId) {
      return apiError("Authentication required", 401);
    }

    const body = await request.json();
    const interviewProfile = body.interviewProfile as InterviewProfile | undefined;

    if (!interviewProfile || !interviewProfile.name) {
      return apiError("interviewProfile with at least a name is required", 400);
    }

    // Check if profile already exists
    const existing = await profileBuilder.getProfile(userId);
    if (existing) {
      return apiError("Profile already exists. Use signals to update.", 409);
    }

    const profile = await profileBuilder.initializeFromInterview(userId, interviewProfile);
    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    return apiError(safeError(error));
  }
}
