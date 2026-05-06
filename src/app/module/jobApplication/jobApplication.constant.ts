import { Prisma } from "../../../../generated/prisma/client";

export const jobApplicationSearchableFields = [
  "userId",
  "jobPostId",
  "jobPost.title",
  "jobPost.location",
  "jobPost.serviceType",
];

export const jobApplicationFilterableFields = ["status", "searchTerm"];

export const jobApplicationIncludeConfig: Partial<
  Record<
    keyof Prisma.JobApplicationInclude,
    Prisma.JobApplicationInclude[keyof Prisma.JobApplicationInclude]
  >
> = {
  user: true,
  jobPost: true,
};
