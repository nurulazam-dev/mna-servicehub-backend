/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { createStripeSession, generateInvoicePdf } from "./payment.utils";
import AppError from "../../errorHelpers/AppError";
import {
  PaymentStatus,
  ServiceRequestStatus,
} from "../../../generated/prisma/enums";
import { sendEmail } from "../../utils/email";
import { uploadFileToCloudinary } from "../../config/cloudinary.config";
import { stripe } from "../../config/stripe.config";
import { envVars } from "../../config/env";

const createPayment = async (payload: {
  requestId: string;
  customerId: string;
}) => {
  const serviceRequest = await prisma.serviceRequest.findUnique({
    where: { id: payload.requestId },
    include: {
      customer: true,
      service: true,
      costBreakdown: true,
      payment: true,
    },
  });

  if (!serviceRequest)
    throw new AppError(status.NOT_FOUND, "Service request not found!");

  if (serviceRequest.customerId !== payload.customerId) {
    throw new AppError(
      status.FORBIDDEN,
      "Unauthorized! This is not your service request.",
    );
  }

  if (serviceRequest.isDeleted) {
    throw new AppError(
      status.GONE,
      "This service request is no longer available.",
    );
  }

  if (serviceRequest.status !== ServiceRequestStatus.COMPLETED) {
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

  if (serviceRequest.payment?.status === PaymentStatus.PAID) {
    throw new AppError(
      status.CONFLICT,
      "This service has already been paid for.",
    );
  }

  // const amount = Number(serviceRequest.costBreakdown?.totalAmount || 0);
  const amount = Number(serviceRequest.costBreakdown?.totalAmount);

  if (!amount || amount <= 0) {
    throw new AppError(
      status.BAD_REQUEST,
      "Invalid payment amount calculated!",
    );
  }

  const transactionId =
    serviceRequest.payment?.transactionId ||
    `TXN-${Date.now()}-${payload.requestId.slice(0, 8)}`;

  const result = await prisma.$transaction(async (tx) => {
    const paymentRecord = await tx.payment.upsert({
      where: { requestId: payload.requestId },
      update: { amount, transactionId, status: PaymentStatus.PENDING },
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

    return { checkoutUrl: session.url };
  });

  return result;
};

const handlerStripeWebhookEvent = async (payload: any, signature: string) => {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      envVars.STRIPE.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (err: any) {
    throw new AppError(status.BAD_REQUEST, `Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { requestId, paymentId } = session.metadata!;

    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id: requestId },
      include: {
        customer: true,
        provider: { include: { user: true } },
        service: true,
        costBreakdown: true,
      },
    });

    if (!serviceRequest) return { message: "Request not found" };

    let finalInvoiceUrl: string | null = null;
    let pdfBuffer: Buffer | null = null;

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.PAID,
        stripeEventId: event.id,
        stripeCustomerId: session.customer as string,
        paymentGatewayData: session as any,
      },
    });

    await prisma.serviceRequest.update({
      where: { id: requestId },
      data: { paymentStatus: PaymentStatus.PAID },
    });

    if (session.payment_status === "paid" && serviceRequest.costBreakdown) {
      try {
        pdfBuffer = await generateInvoicePdf({
          invoiceId: paymentId,
          customerName: serviceRequest.customer.name,
          customerEmail: serviceRequest.customer.email,
          serviceName: serviceRequest.service.name,
          providerName: serviceRequest.provider?.user.name || "N/A",
          amount: Number(serviceRequest.costBreakdown.totalAmount),
          transactionId: updatedPayment.transactionId,
          paymentDate: new Date().toISOString(),
          serviceCharge: Number(serviceRequest.costBreakdown.serviceCharge),
          productCost: Number(serviceRequest.costBreakdown.productCost),
          additionalCost: Number(serviceRequest.costBreakdown.additionalCost),
        });

        const cloudinaryResponse = await uploadFileToCloudinary(
          pdfBuffer,
          `mna-service-hub/invoices/inv-${paymentId}.pdf`,
        );

        finalInvoiceUrl = cloudinaryResponse?.secure_url || null;

        if (finalInvoiceUrl) {
          await prisma.payment.update({
            where: { id: paymentId },
            data: { invoiceUrl: finalInvoiceUrl },
          });
        }
      } catch (err) {
        console.error("PDF/Cloudinary Error:", err);
      }
    }

    if (session.payment_status === "paid") {
      await sendEmail({
        to: serviceRequest.customer.email,
        subject: `Payment Successful - Invoice for ${serviceRequest.service.name}`,
        templateName: "serviceInvoice",
        templateData: {
          name: serviceRequest.customer.name,
          serviceName: serviceRequest.service.name,
          totalAmount: serviceRequest.costBreakdown?.totalAmount,
          invoiceUrl: finalInvoiceUrl,
        },
        attachments: pdfBuffer
          ? [
              {
                filename: `Invoice-${requestId.slice(0, 6)}.pdf`,
                content: pdfBuffer,
                contentType: "application/pdf",
              },
            ]
          : [],
      });
    }
  }

  return { success: true };
};

const getAllPayments = async (query: any) => {
  const { page = 1, limit = 10, searchTerm, status } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const whereConditions: any = {};

  if (searchTerm) {
    whereConditions.OR = [
      { transactionId: { contains: searchTerm, mode: "insensitive" } },
      { stripeCustomerId: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  if (status) {
    whereConditions.status = status;
  }

  const result = await prisma.payment.findMany({
    where: whereConditions,
    skip,
    take: Number(limit),
    orderBy: { createdAt: "desc" },
    include: {
      serviceRequest: {
        include: {
          customer: {
            select: { name: true, email: true },
          },
          service: {
            select: { name: true },
          },
        },
      },
    },
  });

  const total = await prisma.payment.count({ where: whereConditions });
  const totalPages = Math.ceil(total / Number(limit));

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages,
    },
    data: result,
  };
};

const getMyPaidPayments = async (customerId: string, query: any) => {
  const { page = 1, limit = 10 } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const whereConditions: any = {
    status: PaymentStatus.PAID,
    serviceRequest: {
      customerId: customerId,
    },
  };

  const result = await prisma.payment.findMany({
    where: whereConditions,
    skip,
    take: Number(limit),
    orderBy: { updatedAt: "desc" },
    include: {
      serviceRequest: {
        include: {
          service: {
            select: { name: true },
          },
        },
      },
    },
  });

  const total = await prisma.payment.count({ where: whereConditions });
  const totalPages = Math.ceil(total / Number(limit));

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages,
    },
    data: result,
  };
};

const getSinglePayment = async (paymentId: string) => {
  const result = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      serviceRequest: {
        include: {
          customer: {
            select: { name: true, email: true, image: true },
          },
          provider: {
            include: { user: { select: { name: true, email: true } } },
          },
          service: true,
          costBreakdown: true,
        },
      },
    },
  });

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Payment details not found!");
  }

  return result;
};

export const PaymentService = {
  createPayment,
  handlerStripeWebhookEvent,
  getAllPayments,
  getMyPaidPayments,
  getSinglePayment,
};
