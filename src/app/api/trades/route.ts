import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const userId = request.headers.get("x-user-id");

    // Use default user if no userId provided (for backward compatibility)
    const actualUserId = userId || "default-user";

    const where: any = { userId: actualUserId };
    if (status) {
      where.status = status;
    }

    const trades = await prisma.trade.findMany({
      where,
      orderBy: { tradeDate: "desc" },
    });

    return NextResponse.json({ trades });
  } catch (error) {
    console.error("Error fetching trades:", error);
    return NextResponse.json(
      { error: "Failed to fetch trades" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const userId = request.headers.get("x-user-id");

    // Use default user if no userId provided
    const actualUserId = userId || "default-user";

    const trade = await prisma.trade.create({
      data: {
        userId: actualUserId,
        symbol: data.symbol,
        type: data.type,
        quantity: parseFloat(data.quantity),
        entryPrice: parseFloat(data.entryPrice),
        tradeDate: new Date(data.tradeDate),
        setupDescription: data.setupDescription || null,
        reasonToBuy: data.reasonToBuy || null,
        status: "OPEN",
      },
    });

    return NextResponse.json(trade, { status: 201 });
  } catch (error) {
    console.error("Error creating trade:", error);
    return NextResponse.json(
      { error: "Failed to create trade" },
      { status: 500 }
    );
  }
}
