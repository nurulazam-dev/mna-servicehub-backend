/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { ICreatePaymentPayload } from "./payment.interface";
import { createStripeSession, generateInvoicePdf } from "./payment.utils";
import AppError from "../../errorHelpers/AppError";
import {
  PaymentStatus,
  ServiceRequestStatus,
} from "../../../generated/prisma/enums";
import { sendEmail } from "../../utils/email";
import { uploadFileToCloudinary } from "../../config/cloudinary.config";

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

const handlerStripeWebhookEvent = async (event: Stripe.Event) => {
  const existingPayment = await prisma.payment.findFirst({
    where: { stripeEventId: event.id },
  });

  if (existingPayment) {
    return { message: `Event ${event.id} already processed.` };
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as any;
      const requestId = session.metadata?.requestId;
      const paymentId = session.metadata?.paymentId;

      if (!requestId || !paymentId) {
        return { message: "Missing metadata" };
      }

      const serviceRequest = await prisma.serviceRequest.findUnique({
        where: { id: requestId },
        include: {
          customer: true,
          provider: { include: { user: true } },
          service: true,
          costBreakdown: true,
          schedule: true,
        },
      });

      if (!serviceRequest) return { message: "Request not found" };

      let invoiceUrl: string | null = null;
      let pdfBuffer: Buffer | null = null;

      const result = await prisma.$transaction(async (tx) => {
        const updatedPayment = await tx.payment.update({
          where: { id: paymentId },
          data: {
            status: PaymentStatus.PAID,
            paymentGatewayData: session,
            stripeEventId: event.id,
          },
        });

        await tx.serviceRequest.update({
          where: { id: requestId },
          data: {
            paymentStatus: PaymentStatus.PAID,
          },
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
              additionalCost: Number(
                serviceRequest.costBreakdown.additionalCost,
              ),
            });

            const cloudinaryResponse = await uploadFileToCloudinary(
              pdfBuffer,
              `service-hub/invoices/inv-${paymentId}.pdf`,
            );
            invoiceUrl = cloudinaryResponse?.secure_url;

            await tx.payment.update({
              where: { id: paymentId },
              data: { invoiceUrl },
            });
          } catch (err) {
            console.error("PDF Error:", err);
          }
        }
        return { invoiceUrl };
      });

      if (session.payment_status === "paid" && result.invoiceUrl) {
        await sendEmail({
          to: serviceRequest.customer.email,
          subject: `Payment Successful - Invoice for ${serviceRequest.service.name}`,
          templateName: "serviceInvoice",
          templateData: {
            name: serviceRequest.customer.name,
            serviceName: serviceRequest.service.name,
            totalAmount: serviceRequest.costBreakdown?.totalAmount,
            invoiceUrl: result.invoiceUrl,
          },
          attachments: [
            {
              filename: `Invoice-${requestId.slice(0, 6)}.pdf`,
              content: pdfBuffer || Buffer.from(""),
              contentType: "application/pdf",
            },
          ],
        });
      }
      break;
    }
  }
  return { success: true };
};

export const PaymentService = {
  createPayment,
  handlerStripeWebhookEvent,
};
