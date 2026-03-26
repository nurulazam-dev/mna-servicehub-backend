/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";
import {
  ICreateServiceRequestPayload,
  IServiceRequestFilterRequest,
  IUpdateServiceByManagement,
  IUpdateServiceCostPayload,
} from "./serviceRequest.interface";
import {
  ServiceRequestStatus,
  UserRole,
} from "../../../generated/prisma/enums";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { sendEmail } from "../../utils/email";
import { format } from "date-fns";

const createServiceRequest = async (payload: ICreateServiceRequestPayload) => {
  if (!payload.customerId) {
    throw new AppError(status.BAD_REQUEST, "Customer information is missing!");
  }

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
        select: { id: true, name: true, description: true },
      },
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
        },
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

const updateServiceRequestByManagement = async (
  requestId: string,
  payload: IUpdateServiceByManagement,
) => {
  const isRequestExist = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
    include: { customer: true, service: true },
  });

  if (!isRequestExist || isRequestExist.isDeleted) {
    throw new AppError(status.NOT_FOUND, "Service request not found!");
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedData: any = { status: payload.status };

    if (payload.status === "REJECTED") {
      if (!payload.rejectionReason) {
        throw new AppError(status.BAD_REQUEST, "Rejection reason is required!");
      }
      updatedData.rejectionReason = payload.rejectionReason;
      updatedData.providerId = null;
      updatedData.scheduleId = null;
    } else if (payload.status === "ACCEPTED") {
      if (!payload.providerId || !payload.scheduleId) {
        throw new AppError(
          status.BAD_REQUEST,
          "Provider and Schedule are required to accept!",
        );
      }
      updatedData.providerId = payload.providerId;
      updatedData.scheduleId = payload.scheduleId;
      updatedData.rejectionReason = null;
    }

    const updatedRequest = await tx.serviceRequest.update({
      where: { id: requestId },
      data: updatedData,
      include: {
        provider: {
          include: {
            user: { select: { name: true, email: true, phone: true } },
          },
        },
        service: { select: { name: true } },
        schedule: true,
      },
    });

    if (payload.status === "ACCEPTED" && updatedRequest.provider) {
      try {
        const requestWithSchedule = updatedRequest as any;

        const scheduleInfo = requestWithSchedule.schedule
          ? `${format(new Date(requestWithSchedule.schedule.scheduleDate), "dd MMM, yyyy")} at ${requestWithSchedule.schedule.startTime}`
          : "Pending Selection";

        const requestDate = format(
          new Date(isRequestExist.createdAt),
          "dd MMM, yyyy 'at' hh:mm a",
        );

        await sendEmail({
          to: isRequestExist.customer.email,
          subject: "Service Request Accepted - MNA ServiceHub",
          templateName: "serviceAssignment",
          templateData: {
            name: isRequestExist.customer.name,
            customerEmail: isRequestExist.customer.email,
            customerPhone: isRequestExist.customer.phone,
            activePhone: isRequestExist.activePhone,
            customerAddress: isRequestExist.customer.address,
            serviceAddress: isRequestExist.serviceAddress,
            serviceName: updatedRequest.service.name,
            requestTime: requestDate,
            requestId: requestId,
            providerName: updatedRequest.provider.user.name,
            providerPhone: updatedRequest.provider.user.phone,
            providerEmail: updatedRequest.provider.user.email,
            schedule: scheduleInfo, // এটি এখন "26 Mar, 2026 at 10:00 AM" এভাবে দেখাবে
          },
        });
      } catch (error) {
        console.error(
          `Failed to send confirmation email for Request: ${requestId}`,
          error,
        );
      }
    }

    return updatedRequest;
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
  updateServiceRequestByManagement,
};
