import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (!telegramBotToken || !telegramChatId) {
      return NextResponse.json(
        { error: "Missing Telegram credentials in environment variables" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Format the alert message
    const message = `
🚨 *TradingView Alert*
${body.alert || "New trading alert received"}

*Pair:* ${body.symbol || "N/A"}
*Price:* $${body.close || "N/A"}
*Timeframe:* ${body.timeframe || "N/A"}
    `.trim();

    // Send to Telegram
    const response = await fetch(
      `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.statusText}`);
    }

    return NextResponse.json({ success: true, message: "Alert sent to Telegram" });
  } catch (error) {
    console.error("TradingView alert error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process alert" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "TradingView Telegram Alert Webhook",
    version: "1.0.1",
    method: "POST",
    expectedFields: {
      alert: "Alert message",
      symbol: "Trading pair (e.g., BTC/USD)",
      close: "Current price",
    },
  });
}
