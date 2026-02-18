import { PrismaClient } from "@prisma/client";
import { comparePasswords, hashPassword } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const {
      name,
      surname,
      login,
      email,
      phone,
      currentPassword,
      newPassword,
      profileImage,
    } = data;

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password required to change password" },
          { status: 400 }
        );
      }

      const isPasswordValid = await comparePasswords(
        currentPassword,
        user.password
      );

      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 401 }
        );
      }
    }

    // Check if new login already exists (if changed)
    if (login && login !== user.login) {
      const existingLogin = await prisma.user.findUnique({
        where: { login },
      });
      if (existingLogin) {
        return NextResponse.json(
          { error: "Login already taken" },
          { status: 409 }
        );
      }
    }

    // Check if new email already exists (if changed)
    if (email && email !== user.email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email },
      });
      if (existingEmail) {
        return NextResponse.json(
          { error: "Email already registered" },
          { status: 409 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {
      name,
      surname,
      login,
      email,
      phone,
      profileImage,
    };

    // Hash new password if provided
    if (newPassword) {
      updateData.password = await hashPassword(newPassword);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    // Return user data without password
    const { password: _, ...userWithoutPassword } = updatedUser;
    return NextResponse.json(userWithoutPassword, { status: 200 });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile", details: String(error) },
      { status: 500 }
    );
  }
}
