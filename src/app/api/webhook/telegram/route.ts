import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, apiError } from "@/lib/api-utils";

const TELEGRAM_SECRET_TOKEN = process.env.TELEGRAM_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  const rateLimited = checkRateLimit(request, 60);
  if (rateLimited) return rateLimited;

  // Verify webhook signature — fail closed if secret is not configured
  if (!TELEGRAM_SECRET_TOKEN) {
    console.error("[Telegram] TELEGRAM_WEBHOOK_SECRET not configured — rejecting all requests");
    return apiError("Webhook not configured", 503);
  }

  const providedToken = request.headers.get("x-telegram-bot-api-secret-token");
  if (providedToken !== TELEGRAM_SECRET_TOKEN) {
    return apiError("Unauthorized", 401);
  }

  try {
    const body = await request.json();
    const message = body?.message;

    if (message) {
      const chatId = message.chat?.id;
      const text = message.text || "";

      if (!chatId || typeof text !== "string") {
        return NextResponse.json({ status: "ok" }, { status: 200 });
      }

      // TODO: Process the message and send a response via Telegram Bot API
      // Log only non-PII info for debugging
      console.log(`[Telegram] Received message in chat ${chatId}`);
    }

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch {
    console.error("Error processing Telegram webhook");
    return apiError("Webhook processing error");
  }
}
