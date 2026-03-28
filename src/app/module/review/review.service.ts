/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";
import {
  PaymentStatus,
  ServiceRequestStatus,
} from "../../../generated/prisma/enums";
import { ICreateReviewPayload } from "./review.interface";

const giveReview = async (payload: ICreateReviewPayload) => {
  const serviceRequest = await prisma.serviceRequest.findUnique({
    where: { id: payload.requestId },
    include: { payment: true },
  });

  if (!serviceRequest) {
    throw new AppError(status.NOT_FOUND, "Service request not found!");
  }

  if (serviceRequest.customerId !== payload.customerId) {
    throw new AppError(
      status.FORBIDDEN,
      "You are not authorized to review this service request!",
    );
  }

  if (serviceRequest.status !== ServiceRequestStatus.COMPLETED) {
    throw new AppError(
      status.BAD_REQUEST,
      "Service must be completed before reviewing!",
    );
  }

  if (serviceRequest.paymentStatus !== PaymentStatus.PAID) {
    throw new AppError(
      status.BAD_REQUEST,
      "You must complete the payment first!",
    );
  }

  const existingReview = await prisma.review.findUnique({
    where: { requestId: payload.requestId },
  });

  if (existingReview) {
    throw new AppError(
      status.BAD_REQUEST,
      "You have already submitted a review for this service!",
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    const newReview = await tx.review.create({
      data: {
        requestId: payload.requestId,
        customerId: payload.customerId,
        serviceId: serviceRequest.serviceId,
        providerId: serviceRequest.providerId!,
        rating: payload.rating,
        comment: payload.comment,
      },
    });

    const serviceReviews = await tx.review.findMany({
      where: { serviceId: serviceRequest.serviceId },
    });
    const avgServiceRating =
      serviceReviews.reduce((sum, r) => sum + r.rating, 0) /
      serviceReviews.length;

    await tx.service.update({
      where: { id: serviceRequest.serviceId },
      data: {
        averageRating: avgServiceRating,
        totalReviews: serviceReviews.length,
      },
    });

    const providerReviews = await tx.review.findMany({
      where: { providerId: serviceRequest.providerId! },
    });
    const avgProviderRating =
      providerReviews.reduce((sum, r) => sum + r.rating, 0) /
      providerReviews.length;

    await tx.serviceProvider.update({
      where: { id: serviceRequest.providerId! },
      data: {
        averageRating: avgProviderRating,
        totalReviews: providerReviews.length,
      },
    });

    return newReview;
  });

  return result;
};

const getAllReviews = async (query: any) => {
  const { page = 1, limit = 10 } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const result = await prisma.review.findMany({
    skip,
    take: Number(limit),
    orderBy: {
      createdAt: "desc",
    },
    include: {
      customer: {
        select: {
          name: true,
          image: true,
        },
      },
      service: {
        select: {
          name: true,
        },
      },
    },
  });

  const total = await prisma.review.count();
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

export const ReviewService = {
  giveReview,
  getAllReviews,
};
