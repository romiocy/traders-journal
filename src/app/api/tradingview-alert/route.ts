import { NextRequest, NextResponse } from "next/server";

// Convert TradingView interval to readable format (240 → 4h, 60 → 1h, 5 → 5m, D → 1D)
function formatTimeframe(interval: string): string {
  if (!interval) return "";
  // Already formatted (e.g., "4h", "1D")
  if (/[a-zA-Z]/.test(interval)) return interval;
  const mins = parseInt(interval);
  if (isNaN(mins)) return interval;
  if (mins >= 1440) return `${mins / 1440}D`;
  if (mins >= 60) return `${mins / 60}h`;
  return `${mins}m`;
}

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
    const timeframe = formatTimeframe(body.timeframe || "");

    // Build message
    const lines: string[] = [];

    // Header: BTC 4h 🟥 SELL
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
    message: "TradingView Telegram Alert Webhook v3",
    method: "POST",
    expectedFields: {
      symbol: "Auto: {{ticker}}",
      close: "Auto: {{close}}",
      action: "BUY or SELL (set per alert)",
      timeframe: "Auto: {{interval}} (converts 240→4h, 5→5m)",
      tp: "Take profit (optional)",
      sl: "Stop loss (optional)",
      alert: "Extra message (optional)",
    },
  });
}
