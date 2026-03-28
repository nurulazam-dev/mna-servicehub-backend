/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { ReviewService } from "./review.service";

const giveReview = catchAsync(async (req: Request, res: Response) => {
  const customerId = (req.user as any).userId;

  const result = await ReviewService.giveReview({
    ...req.body,
    customerId,
  });

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Review submitted successfully and ratings updated",
    data: result,
  });
});

export const ReviewController = {
  giveReview,
};
