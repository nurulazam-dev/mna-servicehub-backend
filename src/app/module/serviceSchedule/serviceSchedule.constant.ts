import { Prisma } from "../../../../generated/prisma/client";

export const serviceScheduleSearchableFields = [
  "id",
  "serviceRequestId",
  "serviceId",
  "providerId",
  "scheduleDate",
];

export const serviceScheduleFilterableFields = ["isBooked", "searchTerm"];

export const myServiceScheduleIncludeConfig: Partial<
  Record<
    keyof Prisma.ServiceScheduleInclude,
    Prisma.ServiceScheduleInclude[keyof Prisma.ServiceScheduleInclude]
  >
> = {
  serviceRequest: true,
  provider: true,
};
