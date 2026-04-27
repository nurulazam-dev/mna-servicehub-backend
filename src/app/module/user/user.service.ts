import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { UserRole, UserStatus } from "../../../../generated/prisma/enums";
import { envVars } from "../../config/env";
import { sendEmail } from "../../utils/email";
import { generateTemporaryPassword } from "../../utils/passwordGenerator";
import {
  IAdminUpdateUserPayload,
  IRegisterStaffPayload,
  IUserPayload,
} from "./user.interface";
import { hashPassword } from "better-auth/crypto";
import { Prisma, User } from "../../../../generated/prisma/client";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { IQueryParams } from "../../interfaces/query.interface";
import {
  userFilterableFields,
  userIncludeConfig,
  userSearchableFields,
} from "./user.constant";

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
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      role: payload.role as UserRole,
      status: UserStatus.ACTIVE,
      needPasswordChange: true,
      emailVerified: true,
      accounts: {
        create: {
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

const getAllUsers = async (query: IQueryParams) => {
  const queryBuilder = new QueryBuilder<
    User,
    Prisma.UserWhereInput,
    Prisma.UserInclude
  >(prisma.user, query, {
    searchableFields: userSearchableFields,
    filterableFields: userFilterableFields,
  });

  const result = await queryBuilder
    .search()
    .filter()
    /* .where({
      isDeleted: false,
    }) */
    .include({
      serviceProvider: true,
      serviceRequests: true,
      jobApplications: true,
      reviews: true,
    })
    .dynamicInclude(userIncludeConfig)
    .paginate()
    .sort()
    .fields()
    .execute();

  return result;
};

const getAllCustomers = async (query: IQueryParams) => {
  const queryBuilder = new QueryBuilder<
    User,
    Prisma.UserWhereInput,
    Prisma.UserInclude
  >(prisma.user, query, {
    searchableFields: userSearchableFields,
    filterableFields: userFilterableFields,
  });

  const result = await queryBuilder
    .search()
    .filter()
    .where({
      role: UserRole.CUSTOMER,
    })
    .include({
      serviceProvider: true,
      serviceRequests: true,
      jobApplications: true,
      reviews: true,
    })
    .dynamicInclude(userIncludeConfig)
    .paginate()
    .sort()
    .fields()
    .execute();

  return result;
};

const getUserById = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: { id },
  });
  return result;
};

const updateUserById = async (id: string, payload: Partial<IUserPayload>) => {
  const data: Prisma.UserUpdateInput = {};

  if (payload.name !== undefined) data.name = payload.name;
  if (payload.phone !== undefined) data.phone = payload.phone;
  if (payload.image !== undefined) data.image = payload.image;
  if (payload.address !== undefined) data.address = payload.address;

  const result = await prisma.user.update({
    where: { id },
    data,
  });
  return result;
};

const adminUpdateUserById = async (
  id: string,
  payload: IAdminUpdateUserPayload,
) => {
  const data: Prisma.UserUpdateInput = {};

  if (payload.name !== undefined) data.name = payload.name;
  if (payload.phone !== undefined) data.phone = payload.phone;
  if (payload.address !== undefined) data.address = payload.address;
  if (payload.role !== undefined) data.role = payload.role as UserRole;
  if (payload.status !== undefined) data.status = payload.status as UserStatus;
  if (payload.emailVerified !== undefined)
    data.emailVerified = payload.emailVerified;

  const result = await prisma.user.update({
    where: { id },
    data,
  });
  return result;
};

const adminDeleteUserById = async (id: string) => {
  const result = await prisma.user.update({
    where: { id, isDeleted: false },
    data: {
      isDeleted: true,
      status: UserStatus.DELETED,
      deletedAt: new Date(),
    },
  });

  return result;
};

export const UserService = {
  registerStaff,
  getAllUsers,
  getAllCustomers,
  getUserById,
  updateUserById,
  adminUpdateUserById,
  adminDeleteUserById,
};
