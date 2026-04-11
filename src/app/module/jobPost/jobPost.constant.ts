import { Prisma } from "../../../../generated/prisma/client";

export const serviceSearchableFields = [
  "title",
  "description",
  "requirements",
  "location",
  "serviceType",
  "salaryRange",
  "deadline",
];

export const serviceFilterableFields = [
  "isActive",
  "vacancy",
  "serviceType",
  "searchTerm",
];

export const jobPostIncludeConfig: Partial<
  Record<
    keyof Prisma.JobPostInclude,
    Prisma.JobPostInclude[keyof Prisma.JobPostInclude]
  >
> = {
  applications: true,
};
