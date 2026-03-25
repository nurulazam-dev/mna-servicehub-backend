import { z } from "zod";

const createJobApplicationZodSchema = z.object({
  userId: z.string().uuid("User ID must be a valid UUID"),

  jobPostId: z
    .string()
    .uuid("Job Post ID must be a valid UUID")
    .nullable()
    .optional(),

  cvUrl: z.string().url("CV must be a valid URL"),

  status: z.enum(["PENDING", "ACCEPTED", "REJECTED"]).optional(),

  feedback: z
    .string()
    .max(1000, "Feedback must not exceed 1000 characters")
    .nullable()
    .optional(),
});

export const JobApplicationValidation = {
  createJobApplicationZodSchema,
};
