import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminId = request.headers.get("x-admin-id");

    if (!adminId) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { id: adminId },
    });

    if (!admin || !admin.isAdmin) {
      return Response.json({ message: "Access denied" }, { status: 403 });
    }

    const { id: targetUserId } = await params;

    // Prevent admin from deleting themselves
    if (targetUserId === adminId) {
      return Response.json(
        { message: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    // Check target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    // Delete user (trades cascade-delete via schema)
    await prisma.user.delete({
      where: { id: targetUserId },
    });

    return Response.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete user error:", error);
    return Response.json(
      { message: "Error deleting user", error: (error as Error).message },
      { status: 500 }
    );
  }
}
