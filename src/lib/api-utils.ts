import { NextRequest, NextResponse } from "next/server";
import type { SupportedLanguage } from "@/types";

// --- Rate Limiting ---

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAP_MAX_SIZE = 10_000;

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 30; // max requests per window

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function checkRateLimit(
  request: NextRequest,
  maxRequests: number = RATE_LIMIT_MAX,
): NextResponse | null {
  const ip = getClientIP(request);
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    // Evict stale entries when map grows too large
    if (rateLimitMap.size >= RATE_LIMIT_MAP_MAX_SIZE) {
      for (const [key, val] of rateLimitMap) {
        if (now > val.resetAt) rateLimitMap.delete(key);
      }
    }
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return null;
  }

  entry.count++;
  if (entry.count > maxRequests) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  return null;
}

// --- Input Validation ---

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  "en", "hi", "ta", "te", "bn", "mr", "gu", "kn", "ml", "pa", "or", "as", "ur",
];

export const SKILL_LEVELS = ["beginner", "intermediate", "advanced"] as const;
export type SkillLevel = (typeof SKILL_LEVELS)[number];

export function isValidLanguage(lang: unknown): lang is SupportedLanguage {
  return typeof lang === "string" && SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);
}

export function isValidSkillLevel(level: unknown): level is SkillLevel {
  return typeof level === "string" && SKILL_LEVELS.includes(level as SkillLevel);
}

export function sanitizeText(text: string, maxLength: number = 500): string {
  return text.replace(/[\x00-\x1F\x7F]/g, "").slice(0, maxLength).trim();
}

export function isValidId(id: unknown): boolean {
  return typeof id === "string" && id.length > 0 && id.length <= 128 && /^[\w-]+$/.test(id);
}

/**
 * Validate that a URL uses an allowed protocol (https or http only).
 * Returns the URL string if valid, or undefined if not.
 */
export function sanitizeUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      return url;
    }
    return undefined;
  } catch {
    return undefined;
  }
}

// --- Error Handling ---

export function safeError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
}

export function apiError(message: string, status: number = 500): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

// --- AWS Credentials ---

export function getAwsCredentials(): { accessKeyId: string; secretAccessKey: string } | null {
  const accessKeyId = process.env.MY_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.MY_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;

  if (!accessKeyId || !secretAccessKey) return null;
  return { accessKeyId, secretAccessKey };
}

export function getAwsRegion(): string {
  return process.env.MY_AWS_REGION || process.env.AWS_REGION || "ap-south-1";
}

// --- Session Auth ---

/**
 * Extract authenticated userId from the request.
 * Decodes the JWT from the Authorization header (Bearer token).
 * Returns null if not authenticated or token is invalid.
 */
export async function getSessionUserId(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice(7);
  if (!token || !token.startsWith("eyJ") || token.split(".").length !== 3) {
    return null;
  }

  try {
    // Decode JWT payload (base64url)
    const payloadB64 = token.split(".")[1];
    const payload = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf-8"),
    );
    if (payload.sub && typeof payload.sub === "string") {
      // Check expiry
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        return null;
      }
      return payload.sub;
    }
  } catch {
    return null;
  }

  return null;
}
