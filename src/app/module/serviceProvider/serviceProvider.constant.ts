// import { Prisma } from "../../../../generated/prisma/client";

/* export const serviceProviderIncludeConfig: Partial<
  Record<
    keyof Prisma.ServiceProviderInclude,
    Prisma.ServiceProviderInclude[keyof Prisma.ServiceProviderInclude]
  >
> = {
  user: true,
  schedules: true,
  reviews: true,
}; */

export const serviceProviderSearchableFields = [
  "user.name",
  "user.email",
  "user.phone",
];

export const serviceProviderFilterableFields = [
  "isActive",
  "user.isDeleted",
  "searchTerm",
];

export const serviceProviderIncludeConfig = {
  user: true,
  schedules: true,
  reviews: true,
};
