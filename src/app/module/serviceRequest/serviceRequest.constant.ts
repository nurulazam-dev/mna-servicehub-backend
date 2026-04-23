import { Prisma } from "../../../../generated/prisma/client";

export const serviceRequestSearchableFields = [
  "id",
  "serviceRequestId",
  "serviceId",
  "providerId",
  "customerId",
];

export const serviceRequestFilterableFields = ["status", "searchTerm"];

export const myServiceRequestByCustomerIncludeConfig: Partial<
  Record<
    keyof Prisma.ServiceRequestInclude,
    Prisma.ServiceRequestInclude[keyof Prisma.ServiceRequestInclude]
  >
> = {
  service: true,
  customer: true,
  provider: true,
  schedule: true,
  costBreakdown: true,
  review: true,
};
