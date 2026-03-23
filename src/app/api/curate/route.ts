import { NextRequest, NextResponse } from 'next/server';
import { curateCourse } from '@/services/curatorService';
import type { InterviewProfile } from '@/types/interview';
import { checkRateLimit, sanitizeText, apiError, safeError } from '@/lib/api-utils';

/**
 * POST /api/curate
 * Takes a user profile and returns a personalized course plan.
 */
export async function POST(request: NextRequest) {
  const rateLimited = checkRateLimit(request, 10);
  if (rateLimited) return rateLimited;

  try {
    const profile = (await request.json()) as InterviewProfile;

    if (!profile.name || typeof profile.name !== 'string') {
      return apiError('Profile must include a name', 400);
    }

    if (!profile.goals || !Array.isArray(profile.goals) || profile.goals.length === 0) {
      return apiError('Profile must include at least one goal', 400);
    }

    // Sanitize text fields
    profile.name = sanitizeText(profile.name, 100);
    profile.goals = profile.goals
      .filter((g): g is string => typeof g === 'string' && g.trim().length > 0)
      .slice(0, 10)
      .map((g) => sanitizeText(g, 200));

    if (profile.goals.length === 0) {
      return apiError('Goals must contain at least one non-empty string', 400);
    }

    const course = await curateCourse(profile);

    return NextResponse.json({
      course,
      message: `Personalized course created with ${course.modules.length} modules covering ${course.estimated_duration}.`,
    });
  } catch (error) {
    return apiError(safeError(error));
  }
}
