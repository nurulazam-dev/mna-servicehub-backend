import { z } from "zod";

const createJobPostZodSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(150, "Title must not exceed 150 characters"),

  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(2000, "Description must not exceed 2000 characters"),

  requirements: z
    .string()
    .min(10, "Requirements must be at least 10 characters")
    .max(1000, "Requirements must not exceed 1000 characters"),

  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .max(150, "Location must not exceed 150 characters")
    .optional(),

  serviceType: z
    .string()
    .min(2, "Service type must be at least 2 characters")
    .max(100, "Service type must not exceed 100 characters"),

  vacancy: z
    .number()
    .int("Vacancy must be an integer")
    .positive("Vacancy must be greater than 0")
    .optional(),

  salaryRange: z
    .string()
    .max(100, "Salary range must not exceed 100 characters")
    .optional(),

  deadline: z.coerce.date({
    error: "Deadline must be a valid date",
  }),

  isActive: z.boolean().optional(),
});

export const JobPostValidation = {
  createJobPostZodSchema,
};
