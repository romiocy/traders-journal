import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (!telegramBotToken || !telegramChatId) {
      return NextResponse.json(
        { error: "Missing Telegram credentials in environment variables" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Determine action and emoji
    const action = (body.action || "").toUpperCase();
    const actionEmoji = action === "BUY" ? "🟩" : action === "SELL" ? "🟥" : "⚠️";
    const symbol = body.symbol || "N/A";
    const price = body.close || "N/A";
    const timeframe = body.timeframe || "";

    // Build message to match TradingView alert style
    const lines: string[] = [];

    // Header: ETH 4h 🟥 SELL  or  BTC 4h 🟩 BUY
    let header = `*${symbol}*`;
    if (timeframe) header += ` ${timeframe}`;
    header += ` ${actionEmoji}`;
    if (action) header += ` *${action}*`;
    lines.push(header);

    // Separator
    lines.push("━━━━━━━━━━━━━━━");

    // Price
    lines.push(`💰 *PRICE:* ${price}$`);

    // Timeframe
    if (timeframe) lines.push(`⏱ *TIMEFRAME:* ${timeframe}`);

    // Take Profit & Stop Loss
    if (body.tp) lines.push(`🎯 *TAKE PROFIT:* ${body.tp}$`);
    if (body.sl) lines.push(`🛑 *STOP LOSS:* ${body.sl}$`);

    // Extra alert message
    if (body.alert) {
      lines.push("");
      lines.push(`📝 ${body.alert}`);
    }

    // Timestamp
    lines.push("");
    lines.push(`⏰ ${new Date().toLocaleString()}`);

    const message = lines.join("\n");

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
    message: "TradingView Telegram Alert Webhook v2",
    method: "POST",
    expectedFields: {
      symbol: "Trading pair (e.g., BTCUSDT)",
      close: "Current price",
      action: "BUY or SELL",
      timeframe: "e.g., 4h, 1d",
      tp: "Take profit (optional)",
      sl: "Stop loss (optional)",
      alert: "Extra message (optional)",
    },
  });
}
