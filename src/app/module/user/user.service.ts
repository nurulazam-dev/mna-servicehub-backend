import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { UserRole, UserStatus } from "../../../generated/prisma/enums";
import { envVars } from "../../config/env";
import { sendEmail } from "../../utils/email";
import { generateTemporaryPassword } from "../../utils/passwordGenerator";
import { IRegisterStaffPayload } from "./user.interface";
import { hashPassword } from "better-auth/crypto";

const registerStaff = async (payload: IRegisterStaffPayload) => {
  const tempPassword = generateTemporaryPassword(8);
  const hashedPassword = await hashPassword(tempPassword);

  const isExist = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (isExist) {
    throw new AppError(status.CONFLICT, "User with this email already exists!");
  }

  const result = await prisma.user.create({
    data: {
      id: `user_${Date.now()}`,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      role: payload.role as UserRole,
      status: UserStatus.ACTIVE,
      needPasswordChange: true,
      emailVerified: true,
      accounts: {
        create: {
          id: `acc_${Date.now()}`,
          accountId: payload.email,
          providerId: "credential",
          password: hashedPassword,
        },
      },
    },
    include: {
      accounts: true,
    },
  });
  try {
    await sendEmail({
      to: payload.email,
      subject: "MNA ServiceHub Staff Account - Welcome",
      templateName: "staffWelcome",
      templateData: {
        name: payload.name,
        role: payload.role,
        email: payload.email,
        password: tempPassword,
        loginUrl: `${envVars.FRONTEND_URL}/login`,
      },
    });
  } catch (error) {
    console.error("Email sending failed:", error);
  }

  return result;
};

export const UserService = {
  registerStaff,
};
