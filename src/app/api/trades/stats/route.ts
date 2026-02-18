import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id") || "default-user";

    const trades = await prisma.trade.findMany({
      where: { userId },
    });

    // Calculate stats
    const closedTrades = trades.filter((t) => t.status === "CLOSED");
    const openTrades = trades.filter((t) => t.status === "OPEN");

    let totalProfit = 0;
    let winningTrades = 0;

    closedTrades.forEach((trade) => {
      if (trade.profit) {
        totalProfit += trade.profit;
        if (trade.profit > 0) winningTrades++;
      }
    });

    const winRate =
      closedTrades.length > 0
        ? (winningTrades / closedTrades.length) * 100
        : 0;

    return NextResponse.json({
      totalTrades: trades.length,
      winRate: parseFloat(winRate.toFixed(2)),
      totalProfit: parseFloat(totalProfit.toFixed(2)),
      openTrades: openTrades.length,
      closedTrades: closedTrades.length,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
