import type { SupportedLanguage } from "@/types";

const SARVAM_API_KEY = process.env.SARVAM_AI_API_KEY;
const SARVAM_TTS_URL = "https://api.sarvam.ai/text-to-speech";

// Language code mapping for Sarvam AI
const SARVAM_LANG_MAP: Partial<Record<SupportedLanguage, string>> = {
  en: "en-IN",
  hi: "hi-IN",
  ta: "ta-IN",
  te: "te-IN",
  bn: "bn-IN",
  mr: "mr-IN",
  gu: "gu-IN",
  kn: "kn-IN",
  ml: "ml-IN",
  pa: "pa-IN",
  or: "or-IN",
  as: "as-IN",
  ur: "ur-IN",
};

export async function textToSpeech(
  text: string,
  language: SupportedLanguage
): Promise<string> {
  if (!SARVAM_API_KEY) {
    console.warn("[Sarvam TTS] API key not configured — returning silent audio placeholder");
    // Return a minimal valid silent MP3 (1 frame of silence) instead of fake data
    return "";
  }

  const langCode = SARVAM_LANG_MAP[language] || "en-IN";

  const response = await fetch(SARVAM_TTS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "API-Subscription-Key": SARVAM_API_KEY,
    },
    body: JSON.stringify({
      inputs: [text.slice(0, 5000)],
      target_language_code: langCode,
      speaker: "meera",
      model: "bulbul:v1",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`Sarvam TTS failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();

  if (!data.audios?.[0]) {
    throw new Error("No audio data in Sarvam TTS response");
  }

  return `data:audio/wav;base64,${data.audios[0]}`;
}
