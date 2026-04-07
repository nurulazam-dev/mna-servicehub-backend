import { Prisma } from "../../../../generated/prisma/client";

export const userSearchableFields = ["name", "email", "phone"];

export const userFilterableFields = ["isDeleted", "user.role"];

export const userIncludeConfig: Partial<
  Record<keyof Prisma.UserInclude, Prisma.UserInclude[keyof Prisma.UserInclude]>
> = {
  serviceProvider: true,
  serviceRequests: true,
  reviews: true,
};
