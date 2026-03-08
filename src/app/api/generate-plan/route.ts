import { NextRequest, NextResponse } from "next/server";
import { searchNPTEL } from "@/lib/youtube";
import type { SupportedLanguage, ContentResource, CoursePlan } from "@/types";

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
  try {
    const body = await request.json();
    const { topic, language, skillLevel, weeks } = body;

    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    const hasAwsCredentials =
      process.env.MY_AWS_ACCESS_KEY_ID && process.env.MY_AWS_SECRET_ACCESS_KEY;

    if (hasAwsCredentials) {
      try {
        // Dynamically import to avoid crashing when creds are missing
        const { generateCoursePlan } = await import("@/lib/bedrock");
        const { searchYouTube } = await import("@/lib/youtube");

        const plan = await generateCoursePlan(
          topic,
          (language as SupportedLanguage) || "en",
          skillLevel || "beginner",
          weeks || 4
        );

        for (const week of plan.weeks || []) {
          const resources: ContentResource[] = [];
          const searchQuery = week.topics.join(" ");
          const [youtubeResults, nptelResults] = await Promise.all([
            searchYouTube(searchQuery, language || "en", 3).catch(() => []),
            Promise.resolve(searchNPTEL(searchQuery)),
          ]);
          resources.push(...youtubeResults);
          resources.push(...nptelResults);
          week.resources = resources;
        }

        return NextResponse.json(plan);
      } catch (bedrockError) {
        console.error("Bedrock failed, falling back to demo:", bedrockError);
        // Fall through to demo mode
      }
    }

    // Demo mode
    console.log("Using demo mode for course plan generation");
    const demoPlan = getDemoCoursePlan(
      topic,
      (language as SupportedLanguage) || "en",
      skillLevel || "beginner",
      weeks || 4
    );
    return NextResponse.json(demoPlan);
  } catch (error) {
    console.error("Error generating course plan:", error);
    return NextResponse.json(
      { error: "Failed to generate course plan" },
      { status: 500 }
    );
  }
}
