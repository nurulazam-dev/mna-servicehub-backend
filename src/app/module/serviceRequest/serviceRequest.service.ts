/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";
import {
  ICreateServiceRequestPayload,
  IServiceRequestFilterRequest,
  IUpdateServiceCostPayload,
} from "./serviceRequest.interface";
import {
  ServiceRequestStatus,
  UserRole,
} from "../../../generated/prisma/enums";
import { IRequestUser } from "../../interfaces/requestUser.interface";

const createServiceRequest = async (payload: ICreateServiceRequestPayload) => {
  const isServiceExist = await prisma.service.findUnique({
    where: {
      id: payload.serviceId,
      isActive: true,
    },
  });

  if (!isServiceExist) {
    throw new AppError(
      status.NOT_FOUND,
      "Service not found or currently unavailable!",
    );
  }

  const result = await prisma.serviceRequest.create({
    data: {
      customerId: payload.customerId,
      serviceId: payload.serviceId,
      serviceDescription: payload.serviceDescription,
      serviceAddress: payload.serviceAddress,
      activePhone: payload.activePhone,
      status: "PENDING",
    },
    include: {
      service: {
        select: { name: true, description: true },
      },
      customer: {
        select: { name: true, email: true, phone: true, address: true },
      },
    },
  });

  return result;
};

const getMyServiceRequestByCustomer = async (customerId: string) => {
  const result = await prisma.serviceRequest.findMany({
    where: {
      customerId: customerId,
    },
    include: {
      service: {
        select: {
          name: true,
          imageUrl: true,
        },
      },
      provider: {
        select: {
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      },
      schedule: true,
      costBreakdown: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getMyServiceRequestByServiceProvider = async (providerId: string) => {
  const result = await prisma.serviceRequest.findMany({
    where: {
      providerId: providerId,
    },
    include: {
      service: {
        select: {
          name: true,
          description: true,
        },
      },
      customer: {
        select: {
          name: true,
          email: true,
          phone: true,
          address: true,
          isDeleted: true,
        },
      },
      schedule: true,
      costBreakdown: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getServiceRequestById = async (id: string, user: IRequestUser) => {
  const result = await prisma.serviceRequest.findUnique({
    where: { id },
    include: {
      service: true,
      customer: {
        select: { name: true, email: true, phone: true, address: true },
      },
      provider: {
        select: {
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      },
      schedule: true,
      costBreakdown: true,
      payment: true,
    },
  });

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Service request not found!");
  }

  if (user.role === UserRole.CUSTOMER && result.customerId !== user.userId) {
    throw new AppError(
      status.FORBIDDEN,
      "You are not authorized to view this request!",
    );
  }

  if (
    user.role === UserRole.SERVICE_PROVIDER &&
    result.providerId !== user.userId
  ) {
    throw new AppError(status.FORBIDDEN, "This job is not assigned to you!");
  }

  return result;
};

const getAllServiceRequest = async (filters: IServiceRequestFilterRequest) => {
  const { status, searchTerm, page = 1, limit = 10 } = filters;

  const skip = (Number(page) - 1) * Number(limit);

  const whereConditions: any = {};

  if (status) {
    whereConditions.status = status;
  }

  if (searchTerm) {
    whereConditions.OR = [
      { customer: { name: { contains: searchTerm, mode: "insensitive" } } },
      { activePhone: { contains: searchTerm, mode: "insensitive" } },
      { service: { name: { contains: searchTerm, mode: "insensitive" } } },
    ];
  }

  const result = await prisma.serviceRequest.findMany({
    where: whereConditions,
    skip,
    take: Number(limit),
    include: {
      service: { select: { name: true, reviews: true } },
      customer: {
        select: {
          name: true,
          email: true,
          emailVerified: true,
          phone: true,
          address: true,
          isDeleted: true,
          status: true,
        },
      },
      provider: {
        select: {
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      },
      schedule: true,
      payment: {
        select: {
          status: true,
          transactionId: true,
          amount: true,
          invoiceUrl: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const total = await prisma.serviceRequest.count({ where: whereConditions });
  const totalPages = Math.ceil(total / Number(limit));

  return {
    meta: { page, limit, total, totalPages },
    data: result,
  };
};

const cancelServiceRequestByCustomer = async (
  requestId: string,
  userId: string,
) => {
  const isRequestExist = await prisma.serviceRequest.findUnique({
    where: {
      id: requestId,
      isDeleted: false,
    },
  });

  if (!isRequestExist) {
    throw new AppError(
      status.NOT_FOUND,
      "Service request not found or already deleted!",
    );
  }

  if (isRequestExist.customerId !== userId) {
    throw new AppError(
      status.FORBIDDEN,
      "You are not authorized to cancel this request!",
    );
  }

  if (isRequestExist.status !== ServiceRequestStatus.PENDING) {
    throw new AppError(
      status.BAD_REQUEST,
      `Cannot cancel a request that is already ${isRequestExist.status.toLowerCase()}!`,
    );
  }

  const result = await prisma.serviceRequest.update({
    where: { id: requestId },
    data: {
      isDeleted: true,
    },
  });

  return result;
};

const updateServiceRequestByServiceProvider = async (
  requestId: string,
  providerId: string,
  payload: IUpdateServiceCostPayload,
) => {
  const isRequestExist = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
    include: { payment: true },
  });

  if (!isRequestExist || isRequestExist.isDeleted) {
    throw new AppError(status.NOT_FOUND, "Service request not found!");
  }

  if (isRequestExist.providerId !== providerId) {
    throw new AppError(status.FORBIDDEN, "This job is not assigned to you!");
  }

  if (isRequestExist.payment && isRequestExist.payment.status === "succeeded") {
    throw new AppError(
      status.BAD_REQUEST,
      "Payment already completed. You cannot modify costs or status anymore!",
    );
  }

  const totalAmount =
    Number(payload.serviceCharge) +
    Number(payload.productCost) +
    Number(payload.additionalCost);

  const result = await prisma.$transaction(async (tx) => {
    await tx.serviceRequest.update({
      where: { id: requestId },
      data: { status: ServiceRequestStatus.COMPLETED },
    });

    const costData = await tx.costBreakdown.upsert({
      where: { requestId: requestId },
      update: {
        serviceCharge: payload.serviceCharge,
        productCost: payload.productCost,
        additionalCost: payload.additionalCost,
        totalAmount: totalAmount,
      },
      create: {
        requestId: requestId,
        serviceCharge: payload.serviceCharge,
        productCost: payload.productCost,
        additionalCost: payload.additionalCost,
        totalAmount: totalAmount,
      },
    });

    return costData;
  });

  return result;
};

export const ServiceRequestServices = {
  createServiceRequest,
  getMyServiceRequestByCustomer,
  getMyServiceRequestByServiceProvider,
  getServiceRequestById,
  getAllServiceRequest,
  cancelServiceRequestByCustomer,
  updateServiceRequestByServiceProvider,
};
