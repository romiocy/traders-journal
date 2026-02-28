import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get("x-user-id") || "default-user";

    const trade = await prisma.trade.findUnique({
      where: { id: params.id },
    });

    if (!trade) {
      return NextResponse.json({ error: "Trade not found" }, { status: 404 });
    }

    // Verify trade belongs to user
    if (trade.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(trade);
  } catch (error) {
    console.error("Error fetching trade:", error);
    return NextResponse.json(
      { error: "Failed to fetch trade" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const userId = request.headers.get("x-user-id") || "default-user";

    // Calculate profit if both entry and exit prices exist
    let profit: number | null = null;
    let profitPercentage: number | null = null;

    const existingTrade = await prisma.trade.findUnique({
      where: { id: params.id },
    });

    if (!existingTrade) {
      return NextResponse.json({ error: "Trade not found" }, { status: 404 });
    }

    // Verify trade belongs to user
    if (existingTrade.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const exitPrice = data.exitPrice || existingTrade.exitPrice;
    const entryPrice = existingTrade.entryPrice;
    const quantity = existingTrade.quantity;
    const quantityCurrency = existingTrade.quantityCurrency;
    const isFiatQuantity = ["USDT", "USDC", "USD"].includes(quantityCurrency || "");

    if (exitPrice && entryPrice) {
      if (isFiatQuantity) {
        // Quantity is in fiat/stablecoin: calculate crypto amount first, then profit
        // e.g., bought BTC at 64076 for 1000 USDT → 1000/64076 = 0.0156 BTC
        // sold at 64784 → 0.0156 * 64784 = 1011 USDT → profit = 11 USDT
        const cryptoAmount = quantity / entryPrice;
        profit = cryptoAmount * exitPrice - quantity;
      } else {
        // Quantity is in crypto: profit = (exitPrice - entryPrice) * quantity
        profit = (exitPrice - entryPrice) * quantity;
      }
      profitPercentage = ((exitPrice - entryPrice) / entryPrice) * 100;
    }

    const updatedTrade = await prisma.trade.update({
      where: { id: params.id },
      data: {
        exitPrice: data.exitPrice ? parseFloat(data.exitPrice) : undefined,
        exitDate: data.exitDate ? new Date(data.exitDate) : undefined,
        status: data.status,
        profit,
        profitPercentage,
        reasonToSell: data.reasonToSell,
        mistakes: data.mistakes,
        lessonsLearned: data.lessonsLearned,
        notes: data.notes,
      },
    });

    return NextResponse.json(updatedTrade);
  } catch (error) {
    console.error("Error updating trade:", error);
    return NextResponse.json(
      { error: "Failed to update trade" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get("x-user-id") || "default-user";

    const trade = await prisma.trade.findUnique({
      where: { id: params.id },
    });

    if (!trade) {
      return NextResponse.json({ error: "Trade not found" }, { status: 404 });
    }

    // Verify trade belongs to user
    if (trade.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.trade.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting trade:", error);
    return NextResponse.json(
      { error: "Failed to delete trade" },
      { status: 500 }
    );
  }
}
