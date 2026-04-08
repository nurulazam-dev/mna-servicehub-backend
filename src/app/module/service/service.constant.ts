import { Prisma } from "../../../../generated/prisma/client";

export const serviceSearchableFields = ["name", "description"];

export const serviceFilterableFields = ["status", "searchTerm"];

export const serviceIncludeConfig: Partial<
  Record<
    keyof Prisma.ServiceInclude,
    Prisma.ServiceInclude[keyof Prisma.ServiceInclude]
  >
> = {
  serviceRequests: true,
  reviews: true,
};
