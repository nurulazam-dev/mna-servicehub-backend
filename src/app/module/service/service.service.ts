import { prisma } from "../../lib/prisma";
import { IServiceCreatePayload } from "./service.interface";

const createService = async (payload: IServiceCreatePayload) => {
  const result = await prisma.service.create({
    data: payload,
  });
  return result;
};

const getAllServices = async () => {
  const result = await prisma.service.findMany({
    // where: {
    //   isActive: true,
    // },
    include: {
      _count: {
        select: {
          reviews: true,
          serviceRequests: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

const getSingleService = async (id: string) => {
  const result = await prisma.service.findUnique({
    where: { id },
    include: {
      reviews: {
        include: {
          customer: {
            select: { name: true, image: true },
          },
        },
      },
      _count: {
        select: { serviceRequests: true },
      },
    },
  });
  return result;
};

const updateService = async (
  id: string,
  payload: Partial<IServiceCreatePayload>,
) => {
  const result = await prisma.service.update({
    where: { id },
    data: payload,
  });
  return result;
};

export const ServiceServices = {
  createService,
  getAllServices,
  getSingleService,
  updateService,
};
