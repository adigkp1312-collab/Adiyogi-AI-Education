import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Extract message details from Telegram update payload
    const message = body.message;

    if (message) {
      const chatId = message.chat?.id;
      const text = message.text || "";
      const from = message.from?.username || message.from?.first_name || "unknown";

      console.log(
        `[Telegram] Message from ${from} (chat ${chatId}): ${text}`
      );

      // TODO: Process the message and send a response via Telegram Bot API
      // For now, this is a scaffold that logs and returns 200
    }

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Error processing Telegram webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing error" },
      { status: 500 }
    );
  }
}
