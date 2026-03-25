import { z } from "zod";

const createServiceRequestZodSchema = z.object({
  serviceId: z.string().uuid("Service ID must be a valid UUID"),

  serviceDescription: z
    .string()
    .min(10, "Service description must be at least 10 characters")
    .max(2000, "Service description must not exceed 2000 characters"),

  serviceAddress: z
    .string()
    .min(5, "Service address must be at least 5 characters")
    .max(300, "Service address must not exceed 300 characters"),

  activePhone: z
    .string()
    .regex(/^\d{11,13}$/, "Phone number must be 11-13 digits"),
});

const updateServiceRequestByManagementZodSchema = z
  .object({
    status: z.enum(["ACCEPTED", "REJECTED"], {
      error: "Status is required and must be ACCEPTED or REJECTED",
    }),
    rejectionReason: z
      .string()
      .trim()
      .min(5, "Rejection reason must be at least 5 characters")
      .max(500, "Rejection reason must not exceed 500 characters")
      .optional(),

    providerId: z.string().uuid("Invalid Provider ID").optional(),

    scheduleId: z.string().uuid("Invalid Schedule ID").optional(),
  })
  .refine((data) => data.status !== "REJECTED" || !!data.rejectionReason, {
    message: "Rejection reason is required when status is REJECTED",
    path: ["rejectionReason"],
  })
  .refine(
    (data) =>
      data.status !== "ACCEPTED" || (!!data.providerId && !!data.scheduleId),
    {
      message:
        "Provider ID and Schedule ID are required when status is ACCEPTED",
      path: ["providerId"],
    },
  );

const updateServiceCostZodSchema = z
  .object({
    serviceCharge: z
      .number({
        error: "Service charge must be a number",
      })
      .min(0, "Service charge cannot be negative"),

    productCost: z
      .number({
        error: "Product cost must be a number",
      })
      .min(0, "Product cost cannot be negative"),

    additionalCost: z
      .number({
        error: "Additional cost must be a number",
      })
      .min(0, "Additional cost cannot be negative"),
  })
  .refine(
    (data) =>
      data.serviceCharge > 0 || data.productCost > 0 || data.additionalCost > 0,
    {
      message: "At least one cost must be greater than 0",
      path: ["serviceCharge"],
    },
  );

export const ServiceRequestValidation = {
  createServiceRequestZodSchema,
  updateServiceRequestByManagementZodSchema,
  updateServiceCostZodSchema,
};
