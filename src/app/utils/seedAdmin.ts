import { UserRole, UserStatus } from "../../generated/prisma/enums";
import { envVars } from "../config/env";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

export const seedAdmin = async () => {
  try {
    const isAdminExist = await prisma.user.findFirst({
      where: {
        role: UserRole.ADMIN,
      },
    });

    if (isAdminExist) {
      console.log("Admin already exists.");
      return;
    }

    const adminUser = await auth.api.signUpEmail({
      body: {
        email: envVars.ADMIN_EMAIL,
        password: envVars.ADMIN_PASSWORD,
        name: "MNA Admin",
        role: UserRole.ADMIN,
        phone: "01732112345",
      },
    });

    if (!adminUser || !adminUser.user) {
      throw new Error("Failed to create admin user");
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: adminUser.user.id },
        data: {
          emailVerified: true,
          role: UserRole.ADMIN,
          status: UserStatus.ACTIVE,
          needPasswordChange: false,
        },
      });
    });

    console.log("Admin Created Successfully!");
  } catch (error) {
    console.error("Error seeding admin: ", error);

    try {
      const user = await prisma.user.findUnique({
        where: { email: envVars.ADMIN_EMAIL },
      });
      if (user) {
        await prisma.user.delete({ where: { email: envVars.ADMIN_EMAIL } });
        console.log("Cleaned up partial admin data.");
      }
    } catch (cleanupError) {
      console.log(cleanupError);
    }
  }
};
