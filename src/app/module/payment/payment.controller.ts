/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { PaymentService } from "./payment.service";

const createPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.createPayment({
    requestId: req.body.requestId,
    customerId: (req.user as any).userId,
  });

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Payment session created successfully",
    data: result,
  });
});

const handleStripeWebhookEvent = catchAsync(
  async (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"] as string;

    const result = await PaymentService.handlerStripeWebhookEvent(
      req.body,
      signature,
    );

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Stripe webhook processed successfully",
      data: result,
    });
  },
);

const getAllPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.getAllPayments(req.query);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Payments fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getMyPaidPayments = catchAsync(async (req: Request, res: Response) => {
  const customerId = (req.user as any).userId;

  const result = await PaymentService.getMyPaidPayments(customerId, req.query);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Your paid payments fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const PaymentController = {
  createPayment,
  handleStripeWebhookEvent,
  getAllPayments,
  getMyPaidPayments,
};
