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

    // Format the alert message based on action (BUY/SELL)
    const action = (body.action || "").toUpperCase();
    const emoji = action === "BUY" ? "🟩" : action === "SELL" ? "🟥" : "🚨";
    const symbol = body.symbol || "N/A";
    const close = body.close || "N/A";
    const interval = body.interval || "N/A";

    const message = `${symbol} ${interval}h ${emoji} ${action || "ALERT"}
PRICE: ${close}$
TIMEFRAME: ${interval}h`;

    // Send to Telegram
    const response = await fetch(
      `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: message,
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
