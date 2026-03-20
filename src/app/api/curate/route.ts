import { NextRequest, NextResponse } from 'next/server';
import { curateCourse } from '@/services/curatorService';
import type { InterviewProfile } from '@/types/interview';

/**
 * POST /api/curate
 * Takes a user profile and returns a personalized course plan.
 *
 * Body: InterviewProfile
 * Returns: CourseJSON
 */
export async function POST(request: NextRequest) {
  try {
    const profile = (await request.json()) as InterviewProfile;

    if (!profile.name || !profile.goals || profile.goals.length === 0) {
      return NextResponse.json(
        { error: 'Profile must include name and at least one goal' },
        { status: 400 },
      );
    }

    const course = await curateCourse(profile);

    return NextResponse.json({
      course,
      message: `Personalized course created with ${course.modules.length} modules covering ${course.estimated_duration}.`,
    });
  } catch (error) {
    console.error('[Curate API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate course plan' },
      { status: 500 },
    );
  }
}
