import { z } from "zod";

const createServiceZodSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),

  imageUrl: z
    .string()
    .url("Image URL must be a valid URL")
    .nullable()
    .optional(),

  isActive: z.boolean().optional(),
});

const updateServiceZodSchema = z.object({
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters")
    .optional(),

  imageUrl: z
    .string()
    .url("Image URL must be a valid URL")
    .nullable()
    .optional(),

  isActive: z.boolean().optional(),
});

export const ServiceValidation = {
  createServiceZodSchema,
  updateServiceZodSchema,
};
