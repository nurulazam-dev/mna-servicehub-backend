import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateServiceSchedulePayload } from "./serviceSchedule.interface";
import { addMinutes, format, parse } from "date-fns";

const createServiceSchedule = async (
  providerId: string,
  payload: ICreateServiceSchedulePayload,
) => {
  const { scheduleDate, startTime } = payload;

  const targetDate = new Date(scheduleDate);

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
    const slotEnd = addMinutes(slotStart, 180); //every schedule duration is 3 hours+gap 15 minutes

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

export const ServiceScheduleServices = {
  createServiceSchedule,
};
