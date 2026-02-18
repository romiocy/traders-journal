const { PrismaClient } = require("@prisma/client");
const bcryptjs = require("bcryptjs");

const prisma = new PrismaClient();

async function setupAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { login: "rollsergio" },
    });

    if (existingAdmin) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    // Generate salt and hash password
    const salt = bcryptjs.genSaltSync(10);
    const hashedPassword = bcryptjs.hashSync("Roman1984@", salt);

    // Create admin user
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

    console.log("✓ Admin user created successfully");
    console.log(`  Login: ${adminUser.login}`);
    console.log(`  Email: ${adminUser.email}`);
    console.log(`  IsAdmin: ${adminUser.isAdmin}`);
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

setupAdmin();
