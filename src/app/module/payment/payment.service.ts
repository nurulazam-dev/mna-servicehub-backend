import { prisma } from "../../lib/prisma";
import status from "http-status";

import { ICreatePaymentPayload } from "./payment.interface";
import { createStripeSession } from "./payment.utils";
import AppError from "../../errorHelpers/AppError";
import {
  PaymentStatus,
  ServiceRequestStatus,
} from "../../../generated/prisma/enums";

const createPayment = async (payload: ICreatePaymentPayload) => {
  const serviceRequest = await prisma.serviceRequest.findUnique({
    where: { id: payload.requestId },
    include: {
      customer: true,
      service: true,
      costBreakdown: true,
      payment: true,
    },
  });

  if (!serviceRequest) {
    throw new AppError(status.NOT_FOUND, "Service request not found!");
  }

  if (serviceRequest.status !== ServiceRequestStatus.ACCEPTED) {
    throw new AppError(
      status.BAD_REQUEST,
      "You can only pay for completed services!",
    );
  }

  if (!serviceRequest.costBreakdown) {
    throw new AppError(
      status.BAD_REQUEST,
      "Service cost is not yet calculated!",
    );
  }

  if (
    serviceRequest.payment &&
    serviceRequest.payment.status === PaymentStatus.PAID
  ) {
    throw new AppError(
      status.BAD_REQUEST,
      "Payment already completed for this service!",
    );
  }

  const amount = Number(serviceRequest.costBreakdown.totalAmount);
  const transactionId = `TXN-${Date.now()}-${payload.requestId.slice(0, 8)}`;

  const result = await prisma.$transaction(async (tx) => {
    const paymentRecord = await tx.payment.upsert({
      where: { requestId: payload.requestId },
      update: {
        amount,
        transactionId,
        status: PaymentStatus.PENDING,
      },
      create: {
        requestId: payload.requestId,
        amount,
        transactionId,
        status: PaymentStatus.PENDING,
      },
    });

    const session = await createStripeSession({
      amount,
      requestId: payload.requestId,
      paymentId: paymentRecord.id,
      customerEmail: serviceRequest.customer.email,
      serviceName: serviceRequest.service.name,
    });

    return {
      checkoutUrl: session.url,
    };
  });

  return result;
};

export const PaymentService = {
  createPayment,
};
