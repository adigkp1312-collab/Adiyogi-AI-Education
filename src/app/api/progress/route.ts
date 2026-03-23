import { NextRequest, NextResponse } from "next/server";
import { getProgress, markResourceComplete } from "@/lib/dynamodb";
import { checkRateLimit, isValidId, apiError, safeError, getSessionUserId } from "@/lib/api-utils";
import { profileBuilder } from "@/services/profileBuilder";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const rateLimited = checkRateLimit(request);
  if (rateLimited) return rateLimited;

  try {
    const userId = await getSessionUserId(request);
    if (!userId) {
      return apiError("Authentication required", 401);
    }

    const { searchParams } = new URL(request.url);
    const planId = searchParams.get("planId");

    if (!planId) {
      return apiError("planId is required", 400);
    }

    if (!isValidId(planId)) {
      return apiError("Invalid planId format", 400);
    }

    const progress = await getProgress(userId, planId);

    if (!progress) {
      return apiError("Progress not found", 404);
    }

    return NextResponse.json(progress);
  } catch (error) {
    return apiError(safeError(error));
  }
}

export async function POST(request: NextRequest) {
  const rateLimited = checkRateLimit(request);
  if (rateLimited) return rateLimited;

  try {
    const userId = await getSessionUserId(request);
    if (!userId) {
      return apiError("Authentication required", 401);
    }

    const body = await request.json();
    const { planId, resourceId } = body;

    if (!planId || !resourceId) {
      return apiError("planId and resourceId are required", 400);
    }

    if (!isValidId(planId) || !isValidId(resourceId)) {
      return apiError("Invalid ID format", 400);
    }

    await markResourceComplete(userId, planId, resourceId);

    // Emit profile signal (fire-and-forget)
    profileBuilder.ingestSignal(
      profileBuilder.createSignal(userId, 'module_completed', {
        resourceId,
        completedAt: new Date().toISOString(),
      }, planId),
    ).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(safeError(error));
  }
}
