import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const SYSTEM_PROMPT = `You are an expert Trading AI Assistant integrated into a Trader's Journal web application. Your role is to help traders improve their performance.

You can help with:
- Analyzing trading strategies and setups
- Discussing risk management techniques
- Explaining technical analysis concepts (support/resistance, indicators, chart patterns)
- Providing insights on position sizing and portfolio management
- Discussing trading psychology and discipline
- Reviewing trade journal entries and suggesting improvements
- Explaining market concepts (forex, crypto, stocks, futures)

Guidelines:
- Be concise but thorough in your responses
- Always emphasize risk management
- Never give specific buy/sell financial advice or guarantee returns
- Encourage journaling and self-reflection
- Use practical examples when explaining concepts
- If asked about specific tickers, discuss general analysis approaches rather than making predictions
- Support both English and Russian languages — respond in the same language the user writes in`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

    return NextResponse.json({ message: reply });
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get AI response" },
      { status: 500 }
    );
  }
}
