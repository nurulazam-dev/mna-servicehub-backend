import { z } from "zod";

const createServiceScheduleZodSchema = z.object({
  scheduleDate: z
    .string({ error: "Schedule date is required" })
    .refine(
      (date) => new Date(date) >= new Date(new Date().setHours(0, 0, 0, 0)),
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
});

export const ServiceScheduleValidation = {
  createServiceScheduleZodSchema,
};
