import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import type { CoursePlan, CourseWeek, SupportedLanguage } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { getAwsCredentials, getAwsRegion } from "@/lib/api-utils";

let _client: BedrockRuntimeClient | null = null;

function getClient(): BedrockRuntimeClient {
  if (_client) return _client;
  const credentials = getAwsCredentials();
  if (!credentials) {
    throw new Error("AWS credentials not configured. Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.");
  }
  _client = new BedrockRuntimeClient({
    region: getAwsRegion(),
    credentials,
  });
  return _client;
}

const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: "English",
  hi: "Hindi",
  ta: "Tamil",
  te: "Telugu",
  bn: "Bengali",
  mr: "Marathi",
  gu: "Gujarati",
  kn: "Kannada",
  ml: "Malayalam",
  pa: "Punjabi",
  or: "Odia",
  as: "Assamese",
  ur: "Urdu",
};

const MAX_WEEKS = 12;

export async function generateCoursePlan(
  topic: string,
  language: SupportedLanguage = "en",
  skillLevel: "beginner" | "intermediate" | "advanced" = "beginner",
  weeks: number = 4
): Promise<CoursePlan> {
  const langName = LANGUAGE_NAMES[language] || "English";
  const safeWeeks = Math.max(1, Math.min(MAX_WEEKS, weeks));

  // Sanitize topic to prevent prompt injection — strip control characters and limit length
  const safeTopic = topic
    .replace(/[\x00-\x1F\x7F]/g, "")
    .slice(0, 200)
    .trim();

  const prompt = `You are Adiyogi AI, an educational course planner. Create a structured ${safeWeeks}-week learning plan.

Topic: ${safeTopic}
Skill level: ${skillLevel}
Preferred language for content: ${langName}

Return a valid JSON object with this exact structure (no markdown, no extra text):
{
  "weeks": [
    {
      "weekNumber": 1,
      "title": "Week title",
      "description": "Brief description of what the learner will cover",
      "topics": ["topic1", "topic2", "topic3"],
      "searchQueries": ["YouTube search query 1", "YouTube search query 2"]
    }
  ]
}

Guidelines:
- Each week should have 3-5 topics and 2-3 search queries
- Search queries should be specific enough to find good free content on YouTube/NPTEL
- Progress from fundamentals to advanced concepts
- If the language is not English, include search queries in both ${langName} and English
- Keep descriptions concise and actionable`;

  const modelId = process.env.BEDROCK_MODEL_ID || "anthropic.claude-3-sonnet-20240229-v1:0";

  const body = JSON.stringify({
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
  });

  const client = getClient();
  const command = new InvokeModelCommand({
    modelId,
    contentType: "application/json",
    accept: "application/json",
    body,
  });

  const response = await client.send(command);

  if (!response.body) {
    throw new Error("Empty response from Bedrock");
  }

  const responseBody = JSON.parse(new TextDecoder().decode(response.body));

  if (!responseBody.content?.[0]?.text) {
    throw new Error("Unexpected response format from Bedrock");
  }

  const content = responseBody.content[0].text;

  // Extract JSON from the response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse course plan from AI response");
  }

  const parsed = JSON.parse(jsonMatch[0]);

  if (!Array.isArray(parsed.weeks)) {
    throw new Error("Invalid course plan structure: missing weeks array");
  }

  const coursePlan: CoursePlan = {
    id: uuidv4(),
    topic: safeTopic,
    language,
    skill_level: skillLevel,
    totalWeeks: safeWeeks,
    title: safeTopic,
    description: `A ${safeWeeks}-week course on ${safeTopic}`,
    estimated_duration: `${safeWeeks * 5} hours`,
    modules: [],
    tips: [],
    weeks: parsed.weeks.map((w: Record<string, unknown>): CourseWeek => ({
      weekNumber: Number(w.weekNumber) || 1,
      title: String(w.title || ""),
      description: String(w.description || ""),
      topics: Array.isArray(w.topics) ? w.topics.map(String) : [],
      resources: [],
    })),
    createdAt: new Date().toISOString(),
  };

  return coursePlan;
}
