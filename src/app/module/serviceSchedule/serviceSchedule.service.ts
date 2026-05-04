/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateServiceSchedulePayload } from "./serviceSchedule.interface";
import { addMinutes, format, parse } from "date-fns";
import { UserRole } from "../../../../generated/prisma/enums";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { startOfDay, endOfDay } from "date-fns";
import { IQueryParams } from "../../interfaces/query.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Prisma, ServiceSchedule } from "../../../../generated/prisma/client";
import {
  myServiceScheduleIncludeConfig,
  serviceScheduleFilterableFields,
  serviceScheduleSearchableFields,
} from "./serviceSchedule.constant";

const createServiceSchedule = async (
  userId: string,
  payload: ICreateServiceSchedulePayload,
) => {
  const { scheduleDate, startTime } = payload;

  const targetDate = new Date(scheduleDate);

  const provider = await prisma.serviceProvider.findUnique({
    where: { userId },
  });

  if (!provider) {
    throw new AppError(
      status.NOT_FOUND,
      "Service Provider profile not found! Please complete your registration.",
    );
  }

  const providerId = provider.id;

  const isExist = await prisma.serviceSchedule.findFirst({
    where: { providerId, scheduleDate: targetDate },
  });

  if (isExist) {
    throw new AppError(
      status.BAD_REQUEST,
      "Schedules for this date already exist!",
    );
  }

  const slots = [];

  let currentStart = parse(startTime, "hh:mm a", targetDate);

  for (let i = 1; i <= 3; i++) {
    const slotStart = currentStart;
    const slotEnd = addMinutes(slotStart, 180);

    slots.push({
      providerId,
      scheduleDate: targetDate,
      startTime: format(slotStart, "hh:mm a"),
      endTime: format(slotEnd, "hh:mm a"),
      slotNumber: i,
    });

    currentStart = addMinutes(slotStart, 195);
  }

  const result = await prisma.serviceSchedule.createMany({
    data: slots,
  });

  return result;
};

const getMySchedules = async (query: IQueryParams, providerId: string) => {
  /*  const provider = await prisma.serviceProvider.findUnique({
    where: { userId },
  });

  if (!provider) {
    return [];
  } */

  const queryBuilder = new QueryBuilder<
    ServiceSchedule,
    Prisma.ServiceScheduleWhereInput,
    Prisma.ServiceScheduleInclude
  >(prisma.serviceSchedule, query, {
    searchableFields: serviceScheduleSearchableFields,
    filterableFields: serviceScheduleFilterableFields,
  });

  const result = await queryBuilder
    .search()
    .filter()
    .where({
      providerId: providerId,
    })
    .include({
      serviceRequest: {
        select: {
          id: true,
          status: true,
          service: {
            select: { name: true },
          },
        },
      },
      provider: true,
    })
    .dynamicInclude(myServiceScheduleIncludeConfig)
    .paginate()
    .sort()
    .fields()
    .execute();
  return result;
};

const getScheduleByDate = async (user: IRequestUser, date: string) => {
  const targetDate = new Date(date);
  const startDate = startOfDay(targetDate);
  const endDate = endOfDay(targetDate);

  const whereConditions: any = {
    scheduleDate: {
      gte: startDate,
      lte: endDate,
    },
  };

  if (user.role === UserRole.SERVICE_PROVIDER) {
    const provider = await prisma.serviceProvider.findUnique({
      where: { userId: user.userId },
    });

    if (!provider) {
      return [];
    }

    whereConditions.providerId = provider.id;
  }

  const result = await prisma.serviceSchedule.findMany({
    where: whereConditions,
    include: {
      provider: {
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true },
          },
        },
      },
      serviceRequest: {
        select: { id: true, status: true, service: { select: { name: true } } },
      },
    },
    orderBy: {
      startTime: "asc",
    },
  });

  return result;
};

const getServiceSchedules = async () => {
  const result = await prisma.serviceSchedule.findMany({
    include: {
      provider: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      },
      serviceRequest: {
        select: {
          id: true,
          status: true,
          service: {
            select: { name: true },
          },
        },
      },
    },
    orderBy: {
      scheduleDate: "desc",
    },
  });

  return result;
};

const getScheduleById = async (user: IRequestUser, id: string) => {
  const result = await prisma.serviceSchedule.findUnique({
    where: { id },
    include: {
      provider: {
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true },
          },
        },
      },
      serviceRequest: {
        include: {
          service: { select: { name: true } },
          customer: { select: { name: true, email: true } },
        },
      },
    },
  });

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Service schedule not found!");
  }

  if (
    user.role === UserRole.SERVICE_PROVIDER &&
    result.provider.userId !== user.userId
  ) {
    throw new AppError(
      status.FORBIDDEN,
      "You do not have permission to view this schedule!",
    );
  }

  return result;
};

export const ServiceScheduleServices = {
  createServiceSchedule,
  getMySchedules,
  getScheduleByDate,
  getServiceSchedules,
  getScheduleById,
};
