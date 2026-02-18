import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const adminId = request.headers.get("x-admin-id");

    // Get the requesting user
    if (!adminId) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { id: adminId },
    });

    if (!admin || !admin.isAdmin) {
      return Response.json({ message: "Access denied" }, { status: 403 });
    }

    // Get all users with their trades
    const users = await prisma.user.findMany({
      select: {
        id: true,
        login: true,
        name: true,
        surname: true,
        email: true,
        phone: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
        profileImage: true,
        trades: {
          select: {
            id: true,
            symbol: true,
            type: true,
            quantity: true,
            entryPrice: true,
            exitPrice: true,
            profit: true,
            profitPercentage: true,
            status: true,
            tradeDate: true,
            exitDate: true,
          },
          orderBy: {
            tradeDate: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Enhance user data with portfolio stats
    const usersWithStats = users.map((user: any) => {
      const trades = user.trades || [];
      const closedTrades = trades.filter((t: any) => t.status === "CLOSED");
      const openTrades = trades.filter((t: any) => t.status === "OPEN");
      const winningTrades = closedTrades.filter((t: any) => t.profit && t.profit > 0);
      const losingTrades = closedTrades.filter((t: any) => t.profit && t.profit <= 0);

      const totalProfit = closedTrades.reduce((sum: number, t: any) => sum + (t.profit || 0), 0);
      const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;
      const bestTrade = closedTrades.length > 0 ? Math.max(...closedTrades.map((t: any) => t.profit || 0)) : 0;
      const worstTrade = closedTrades.length > 0 ? Math.min(...closedTrades.map((t: any) => t.profit || 0)) : 0;

      // Calculate open position value
      const openPositionValue = openTrades.reduce((sum: number, t: any) => {
        return sum + (t.quantity * t.entryPrice);
      }, 0);

      return {
        id: user.id,
        login: user.login,
        name: user.name,
        surname: user.surname,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
        profileImage: user.profileImage,
        tradeCount: trades.length,
        portfolio: {
          totalTrades: trades.length,
          openTrades: openTrades.length,
          closedTrades: closedTrades.length,
          winningTrades: winningTrades.length,
          losingTrades: losingTrades.length,
          totalProfit: parseFloat(totalProfit.toFixed(2)),
          winRate: parseFloat(winRate.toFixed(1)),
          bestTrade: parseFloat(bestTrade.toFixed(2)),
          worstTrade: parseFloat(worstTrade.toFixed(2)),
          openPositionValue: parseFloat(openPositionValue.toFixed(2)),
        },
        recentTrades: trades.slice(0, 5).map((t: any) => ({
          id: t.id,
          symbol: t.symbol,
          type: t.type,
          entryPrice: t.entryPrice,
          exitPrice: t.exitPrice,
          profit: t.profit,
          profitPercentage: t.profitPercentage,
          status: t.status,
          tradeDate: t.tradeDate,
        })),
      };
    });

    return Response.json(usersWithStats, { status: 200 });
  } catch (error) {
    console.error("Get users error:", error);
    return Response.json(
      { message: "Error fetching users", error: (error as Error).message },
      { status: 500 }
    );
  }
}
