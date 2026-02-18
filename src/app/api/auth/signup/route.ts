import { PrismaClient } from "@prisma/client";
import { hashPassword } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { login, password, name, surname, email, phone } = await request.json();

    // Validate input
    if (!login || !password || !name || !surname || !email) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ login }, { email }],
      },
    });

    if (existingUser) {
      return Response.json(
        { error: "Login or email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    let hashedPassword: string;
    try {
      hashedPassword = await hashPassword(password);
    } catch (hashError) {
      console.error("Password hashing error:", hashError);
      return Response.json(
        { error: "Failed to process password" },
        { status: 500 }
      );
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        login,
        password: hashedPassword,
        name,
        surname,
        email,
        phone: phone || null,
      },
    });

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    return Response.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return Response.json(
      { error: "Failed to create account", details: String(error) },
      { status: 500 }
    );
  }
}
