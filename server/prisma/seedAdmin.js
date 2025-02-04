// seedAdmin.js

import { PrismaClient, UserStatus, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Define your admin user details
  const adminEmail = "admin@example.com";
  const adminUsername = "admin";
  const adminPassword = "Anihortes"; 

  // Check if an admin with the same email already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log("Admin user already exists.");
    return;
  }

  // Hash the password
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  // Create the admin user
  const adminUser = await prisma.user.create({
    data: {
      username: adminUsername,
      email: adminEmail,
      passwordHash,
      role: UserRole.Admin, // Use your enum value for admin
      status: UserStatus.Online, // Optional: set a status if needed
      isVerified: true, // Mark as verified
    },
  });

  console.log("Admin user seeded successfully:", adminUser);
}

main()
  .catch((error) => {
    console.error("Error seeding admin user:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
