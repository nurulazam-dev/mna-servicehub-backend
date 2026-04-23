import { prisma } from "../../lib/prisma";
import { Prisma, ServiceProvider } from "../../../../generated/prisma/client";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { IQueryParams } from "../../interfaces/query.interface";
import {
  serviceProviderFilterableFields,
  serviceProviderIncludeConfig,
  serviceProviderSearchableFields,
} from "./serviceProvider.constant";

const getAllServiceProviders = async (query: IQueryParams) => {
  const queryBuilder = new QueryBuilder<
    ServiceProvider,
    Prisma.ServiceProviderWhereInput,
    Prisma.ServiceProviderInclude
  >(prisma.serviceProvider, query, {
    searchableFields: serviceProviderSearchableFields,
    filterableFields: serviceProviderFilterableFields,
  });

  const result = await queryBuilder
    .search()
    .filter()
    /* .where({
      isDeleted: false,
    }) */
    .include({
      user: true,
      schedules: true,
      reviews: true,
    })
    .dynamicInclude(serviceProviderIncludeConfig)
    .paginate()
    // .sort()
    .fields()
    .execute();

  return result;
};

const getServiceProviderById = async (id: string) => {
  const result = await prisma.serviceProvider.findUnique({
    where: { id },
  });
  return result;
};

/* const updateUserById = async (id: string, payload: Partial<IUserPayload>) => {
  const data: Prisma.UserUpdateInput = {};

  if (payload.name !== undefined) data.name = payload.name;
  if (payload.phone !== undefined) data.phone = payload.phone;
  if (payload.image !== undefined) data.image = payload.image;
  if (payload.address !== undefined) data.address = payload.address;

  const result = await prisma.user.update({
    where: { id },
    data,
  });
  return result;
}; */

export const ServiceProviderService = {
  getAllServiceProviders,
  getServiceProviderById,
  // updateUserById,
};
