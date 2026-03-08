import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import type { CoursePlan, CourseWeek, SupportedLanguage } from "@/types";
import { v4 as uuidv4 } from "uuid";

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

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

export async function generateCoursePlan(
  topic: string,
  language: SupportedLanguage = "en",
  skillLevel: "beginner" | "intermediate" | "advanced" = "beginner",
  weeks: number = 4
): Promise<CoursePlan> {
  const langName = LANGUAGE_NAMES[language] || "English";

  const prompt = `You are Adiyogi AI, an educational course planner. Create a structured ${weeks}-week learning plan for the topic: "${topic}"

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

  const command = new InvokeModelCommand({
    modelId,
    contentType: "application/json",
    accept: "application/json",
    body,
  });

  const response = await client.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  const content = responseBody.content[0].text;

  // Extract JSON from the response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse course plan from AI response");
  }

  const parsed = JSON.parse(jsonMatch[0]);

  const coursePlan: CoursePlan = {
    id: uuidv4(),
    topic,
    language,
    skill_level: skillLevel,
    totalWeeks: weeks,
    title: topic,
    description: `A ${weeks}-week course on ${topic}`,
    estimated_duration: `${weeks * 5} hours`,
    modules: [],
    tips: [],
    weeks: parsed.weeks.map((w: any): CourseWeek => ({
      weekNumber: w.weekNumber,
      title: w.title,
      description: w.description,
      topics: w.topics,
      resources: [],
    })),
    createdAt: new Date().toISOString(),
  };

  return coursePlan as CoursePlan;
}
