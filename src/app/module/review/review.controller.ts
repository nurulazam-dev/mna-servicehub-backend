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

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.getAllReviews(req.query);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "All reviews fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const deleteReviewById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ReviewService.deleteReviewById(id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Review deleted successfully",
    data: result,
  });
});

const getMyReviews = catchAsync(async (req: Request, res: Response) => {
  const customerId = (req.user as any).userId;
  const result = await ReviewService.getMyReviews(customerId, req.query);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Your reviews fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getMyReviewsBySP = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as any).userId;
  const result = await ReviewService.getMyReviewsBySP(userId, req.query);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Provider reviews fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getReviewsByService = catchAsync(async (req: Request, res: Response) => {
  const { serviceId } = req.params;

  const result = await ReviewService.getReviewsByService(
    serviceId as string,
    req.query,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Reviews for this service fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const ReviewController = {
  giveReview,
  getAllReviews,
  deleteReviewById,
  getMyReviews,
  getMyReviewsBySP,
  getReviewsByService,
};
