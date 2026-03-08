import { NextRequest, NextResponse } from "next/server";
import { textToSpeech } from "@/lib/sarvam";
import type { SupportedLanguage } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, language } = body;

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const audioBase64 = await textToSpeech(
      text,
      (language as SupportedLanguage) || "hi"
    );

    return NextResponse.json({ audio: audioBase64 });
  } catch (error) {
    console.error("Error in text-to-speech:", error);
    return NextResponse.json(
      { error: "Failed to convert text to speech" },
      { status: 500 }
    );
  }
}
