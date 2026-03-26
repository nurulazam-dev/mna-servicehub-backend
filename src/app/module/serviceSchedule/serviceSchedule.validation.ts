import { z } from "zod";
import { parse, isBefore, startOfToday, isSameDay } from "date-fns";

const parseTime = (time: string) => {
  return parse(time, "hh:mm a", new Date());
};

const createServiceScheduleZodSchema = z
  .object({
    scheduleDate: z.string({ error: "Schedule date is required" }).refine(
      (date) => {
        const inputDate = new Date(date);
        return !isBefore(inputDate, startOfToday());
      },
      {
        message: "Schedule date cannot be a past date",
      },
    ),

    startTime: z
      .string({ error: "Initial start time is required" })
      .regex(
        /^(0?[1-9]|1[0-2]):[0-5][0-9]\s(AM|PM)$/i,
        "Invalid time format (e.g. 10:00 AM)",
      ),
  })
  .refine(
    (data) => {
      const today = new Date();
      const inputDate = new Date(data.scheduleDate);

      if (isSameDay(inputDate, today)) {
        const inputTime = parseTime(data.startTime);
        return !isBefore(inputTime, today);
      }

      return true;
    },
    {
      message: "Schedule time cannot be a past time for today",
      path: ["startTime"],
    },
  );

export const ServiceScheduleValidation = {
  createServiceScheduleZodSchema,
};
