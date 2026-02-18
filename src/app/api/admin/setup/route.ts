export const dynamic = 'force-dynamic';

import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { login: "rollsergio" },
    });

    if (existingAdmin) {
      return Response.json(
        { message: "Admin user already exists" },
        { status: 400 }
      );
    }

    // Generate salt and hash password
    const salt = bcryptjs.genSaltSync(10);
    const hashedPassword = bcryptjs.hashSync("Roman1984@", salt);

    // Create admin user with unique email
    const adminUser = await prisma.user.create({
      data: {
        login: "rollsergio",
        password: hashedPassword,
        name: "Admin",
        surname: "User",
        email: `admin-${Date.now()}@tradersjournal.com`,
        phone: "+1-000-000-0000",
        isAdmin: true,
      },
    });

    return Response.json(
      { message: "Admin user created successfully", user: { login: adminUser.login, isAdmin: adminUser.isAdmin } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin setup error:", error);
    return Response.json(
      { message: "Error creating admin user", error: (error as Error).message },
      { status: 500 }
    );
  }
}
