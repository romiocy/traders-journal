import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const adminLogin = request.headers.get("x-admin-login");
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

    // Get all users
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
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Enhance user data with trade count
    const usersWithStats = users.map((user: any) => ({
      ...user,
      tradeCount: user.trades.length,
      trades: undefined,
    }));

    return Response.json(usersWithStats, { status: 200 });
  } catch (error) {
    console.error("Get users error:", error);
    return Response.json(
      { message: "Error fetching users", error: (error as Error).message },
      { status: 500 }
    );
  }
}
