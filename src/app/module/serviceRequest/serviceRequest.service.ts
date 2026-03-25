import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";
import { ICreateServiceRequestPayload } from "./serviceRequest.interface";

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
  /* 
customerId: string;
  serviceId: string;
  serviceDescription: string;
  serviceAddress: string;
  activePhone: string;
*/
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

export const ServiceRequestServices = { createServiceRequest };
