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

export const PaymentController = {
  createPayment,
  handleStripeWebhookEvent,
};
