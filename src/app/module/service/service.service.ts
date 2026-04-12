import status from "http-status";
import { Prisma, Service } from "../../../../generated/prisma/client";
import AppError from "../../errorHelpers/AppError";
import { IQueryParams } from "../../interfaces/query.interface";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { IServiceCreatePayload } from "./service.interface";

const createService = async (payload: IServiceCreatePayload) => {
  const exitService = await prisma.service.findFirst({
    where: {
      name: payload.name,
    },
  });

  if (exitService) {
    throw new AppError(status.BAD_REQUEST, "Service already exists");
  }

  const result = await prisma.service.create({
    data: payload,
  });
  return result;
};

/* const getAllServices = async () => {
  const result = await prisma.service.findMany({
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
}; */

const getAllServices = async (query: IQueryParams) => {
  const queryBuilder = new QueryBuilder<
    Service,
    Prisma.ServiceWhereInput,
    Prisma.ServiceInclude
  >(prisma.service, query, {
    searchableFields: ["name", "description"],
    filterableFields: ["isActive", "isDeleted"],
  });

  const result = await queryBuilder
    .search()
    .filter()
    .include({
      _count: {
        select: {
          reviews: true,
          serviceRequests: true,
        },
      },
    })
    .paginate()
    .sort()
    .fields()
    .execute();

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

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Service not found");
  }

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

const deleteService = async (id: string) => {
  try {
    const result = await prisma.service.update({
      where: {
        id,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    return result;
  } catch (error: unknown) {
    console.log(error);
    throw new AppError(
      status.NOT_FOUND,
      "Service not found or already deleted!",
    );
  }
};

export const ServiceServices = {
  createService,
  getAllServices,
  getSingleService,
  updateService,
  deleteService,
};
