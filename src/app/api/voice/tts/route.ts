import { NextRequest, NextResponse } from "next/server";
import { textToSpeech } from "@/lib/sarvam";
import type { SupportedLanguage } from "@/types";
import {
  checkRateLimit,
  isValidLanguage,
  sanitizeText,
  apiError,
  safeError,
} from "@/lib/api-utils";

const MAX_TEXT_LENGTH = 5000;

export async function POST(request: NextRequest) {
  const rateLimited = checkRateLimit(request, 20);
  if (rateLimited) return rateLimited;

  try {
    const body = await request.json();
    const { text: rawText, language: rawLang } = body;

    if (!rawText || typeof rawText !== "string" || !rawText.trim()) {
      return apiError("Text is required", 400);
    }

    if (rawText.length > MAX_TEXT_LENGTH) {
      return apiError(`Text exceeds maximum length of ${MAX_TEXT_LENGTH} characters`, 400);
    }

    const text = sanitizeText(rawText, MAX_TEXT_LENGTH);
    const language: SupportedLanguage = isValidLanguage(rawLang) ? rawLang : "hi";

    const audioBase64 = await textToSpeech(text, language);

    return NextResponse.json({ audio: audioBase64 });
  } catch (error) {
    return apiError(safeError(error));
  }
}
