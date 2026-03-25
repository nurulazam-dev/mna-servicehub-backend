import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { IRegisterStaffPayload } from "../admin/admin.interface";
import { UserStatus } from "../../../generated/prisma/enums";

const registerStaff = async (payload: IRegisterStaffPayload) => {
  const tempPassword = generateTemporaryPassword();

  const userExists = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (userExists) {
    throw new AppError(
      status.CONFLICT,
      `${userExists} user is already exists!`,
    );
  }

  const result = await prisma.user.create({
    data: {
      ...payload,
      password: tempPassword,
      status: UserStatus.ACTIVE,
      needPasswordChange: true,
    },
  });

  // await sendEmail(payload.email, "Your Staff Account", `Pass: ${tempPassword}`);
  return result;
};

export const UserService = {
  registerStaff,
};
