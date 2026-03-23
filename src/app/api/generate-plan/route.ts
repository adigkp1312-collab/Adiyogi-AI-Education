import { NextRequest, NextResponse } from "next/server";
import { searchNPTEL } from "@/lib/youtube";
import type { SupportedLanguage, ContentResource, CoursePlan } from "@/types";
import {
  checkRateLimit,
  isValidLanguage,
  isValidSkillLevel,
  sanitizeText,
  safeError,
  apiError,
  getAwsCredentials,
  getSessionUserId,
} from "@/lib/api-utils";
import { profileBuilder } from "@/services/profileBuilder";

const MAX_WEEKS = 12;

// Demo course plan for when AWS Bedrock is not configured
function getDemoCoursePlan(
  topic: string,
  language: SupportedLanguage,
  skillLevel: string,
  weeks: number
): CoursePlan {
  const weekPlans = Array.from({ length: weeks }, (_, i) => {
    const weekNum = i + 1;
    const titles = [
      `Introduction to ${topic}`,
      `Core Fundamentals of ${topic}`,
      `Advanced ${topic} Techniques`,
      `${topic} Mastery & Projects`,
    ];
    const topicsMap = [
      [`What is ${topic}?`, "Key concepts and terminology", "History and evolution", "Setting up your environment"],
      ["Core principles and theory", "Hands-on exercises", "Common tools and frameworks", "Best practices"],
      ["Advanced concepts", "Real-world applications", "Case studies", "Project work"],
      ["Capstone project", "Industry best practices", "Career pathways", "Further learning resources"],
    ];
    const idx = Math.min(weekNum - 1, 3);
    const nptelResults = searchNPTEL(topic);
    return {
      weekNumber: weekNum,
      title: titles[idx],
      description: `Week ${weekNum}: ${titles[idx]} — covering essential concepts and hands-on practice.`,
      topics: topicsMap[idx],
      resources: nptelResults.slice(0, 2) as ContentResource[],
    };
  });

  return {
    id: `demo-${Date.now()}`,
    topic,
    language,
    skill_level: skillLevel,
    totalWeeks: weeks,
    title: `${topic} — Complete Learning Path`,
    description: `A structured ${weeks}-week course to master ${topic}, from fundamentals to advanced applications.`,
    estimated_duration: `${weeks * 5} hours`,
    modules: [],
    tips: [
      "Set a consistent daily study schedule",
      "Practice with hands-on coding exercises",
      "Join online communities for peer learning",
      "Build a portfolio project as you learn",
    ],
    weeks: weekPlans,
    createdAt: new Date().toISOString(),
  };
}

export async function POST(request: NextRequest) {
  const rateLimited = checkRateLimit(request, 10);
  if (rateLimited) return rateLimited;

  try {
    const body = await request.json();
    const { topic: rawTopic, language: rawLang, skillLevel: rawLevel, weeks: rawWeeks } = body;

    if (!rawTopic || typeof rawTopic !== "string" || !rawTopic.trim()) {
      return apiError("Topic is required", 400);
    }

    const topic = sanitizeText(rawTopic, 200);
    const language: SupportedLanguage = isValidLanguage(rawLang) ? rawLang : "en";
    const skillLevel = isValidSkillLevel(rawLevel) ? rawLevel : "beginner";
    const weeks = Math.max(1, Math.min(MAX_WEEKS, Number(rawWeeks) || 4));

    const credentials = getAwsCredentials();

    if (credentials) {
      try {
        const { generateCoursePlan } = await import("@/lib/bedrock");
        const { searchYouTube } = await import("@/lib/youtube");

        const plan = await generateCoursePlan(topic, language, skillLevel, weeks);

        for (const week of plan.weeks || []) {
          const resources: ContentResource[] = [];
          const searchQuery = week.topics.join(" ");
          const [youtubeResults, nptelResults] = await Promise.all([
            searchYouTube(searchQuery, language, 3).catch(() => []),
            Promise.resolve(searchNPTEL(searchQuery)),
          ]);
          resources.push(...youtubeResults);
          resources.push(...nptelResults);
          week.resources = resources;
        }

        // Emit course_started signal (fire-and-forget)
        const userId = await getSessionUserId(request);
        if (userId && plan.id) {
          profileBuilder.ingestSignal(
            profileBuilder.createSignal(userId, 'course_started', { topic }, plan.id),
          ).catch(() => {});
        }

        return NextResponse.json(plan);
      } catch (bedrockError) {
        console.error("Bedrock unavailable, falling back to demo mode:", safeError(bedrockError));
      }
    }

    // Demo mode
    const demoPlan = getDemoCoursePlan(topic, language, skillLevel, weeks);

    // Emit course_started signal for demo plans too
    const userId = await getSessionUserId(request);
    if (userId && demoPlan.id) {
      profileBuilder.ingestSignal(
        profileBuilder.createSignal(userId, 'course_started', { topic }, demoPlan.id),
      ).catch(() => {});
    }

    return NextResponse.json(demoPlan);
  } catch (error) {
    return apiError(safeError(error));
  }
}
