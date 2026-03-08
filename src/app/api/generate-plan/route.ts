import { NextRequest, NextResponse } from "next/server";
import { generateCoursePlan } from "@/lib/bedrock";
import { searchYouTube, searchNPTEL } from "@/lib/youtube";
import type { SupportedLanguage, ContentResource } from "@/types";

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

    // Generate the course plan structure via Bedrock
    const plan = await generateCoursePlan(
      topic,
      (language as SupportedLanguage) || "en",
      skillLevel || "beginner",
      weeks || 4
    );

    // For each week, search for YouTube and NPTEL resources using the week's topics
    for (const week of plan.weeks || []) {
      const resources: ContentResource[] = [];

      // Build a search query from the week's topics
      const searchQuery = week.topics.join(" ");

      // Fetch YouTube and NPTEL resources in parallel
      const [youtubeResults, nptelResults] = await Promise.all([
        searchYouTube(searchQuery, language || "en", 3).catch(() => []),
        Promise.resolve(searchNPTEL(searchQuery)),
      ]);

      resources.push(...youtubeResults);
      resources.push(...nptelResults);

      week.resources = resources;
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Error generating course plan:", error);
    return NextResponse.json(
      { error: "Failed to generate course plan" },
      { status: 500 }
    );
  }
}
