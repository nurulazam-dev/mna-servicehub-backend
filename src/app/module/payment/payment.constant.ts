import { Prisma } from "../../../../generated/prisma/client";

export const paymentSearchableFields = ["transactionId", "stripeCustomerId"];

export const paymentFilterableFields = ["status", "requestId", "searchTerm"];

export const paymentIncludeConfig: Partial<
  Record<
    keyof Prisma.PaymentInclude,
    Prisma.PaymentInclude[keyof Prisma.PaymentInclude]
  >
> = {
  serviceRequest: true,
};
