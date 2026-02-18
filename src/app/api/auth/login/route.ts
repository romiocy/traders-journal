import { PrismaClient } from "@prisma/client";
import { comparePasswords } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { login, password } = await request.json();

    // Validate input
    if (!login || !password) {
      return Response.json(
        { error: "Login and password are required" },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { login },
    });

    if (!user) {
      return Response.json(
        { error: "Invalid login or password" },
        { status: 401 }
      );
    }

    // Compare passwords
    const isPasswordValid = await comparePasswords(password, user.password);

    if (!isPasswordValid) {
      return Response.json(
        { error: "Invalid login or password" },
        { status: 401 }
      );
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    return Response.json(userWithoutPassword, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return Response.json(
      { error: "Failed to login" },
      { status: 500 }
    );
  }
}
