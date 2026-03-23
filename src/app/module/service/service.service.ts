import { prisma } from "../../lib/prisma";
import { IServicePayload } from "./service.interface";

const createService = async (payload: IServicePayload) => {
  const result = await prisma.service.create({
    data: payload,
  });
  return result;
};

const getAllServices = async () => {
  const result = await prisma.service.findMany({
    where: {
      isActive: true,
    },
    include: {
      _count: {
        select: {
          reviews: true,
          serviceRequests: true,
        },
      },
    },
  });
  return result;
};

const getSingleService = async (id: string) => {
  const result = await prisma.service.findUnique({
    where: { id },
    include: {
      reviews: true,
      _count: {
        select: { serviceRequests: true },
      },
    },
  });
  return result;
};

const updateService = async (id: string, payload: Partial<IServicePayload>) => {
  const result = await prisma.service.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteService = async (id: string) => {
  const result = await prisma.service.delete({
    where: { id },
  });
  return result;
};

export const ServiceServices = {
  createService,
  getAllServices,
  getSingleService,
  updateService,
  deleteService,
};
