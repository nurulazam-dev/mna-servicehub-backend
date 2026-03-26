import { z } from "zod";
import { JobApplicationStatus } from "../../../generated/prisma/enums";

const createJobApplicationZodSchema = z.object({
  userId: z.string(),
  // .uuid("User ID must be a valid UUID"),

  jobPostId: z
    .string()
    // .uuid("Job Post ID must be a valid UUID")
    .nullable()
    .optional(),

  // cvUrl: z.string().url("CV must be a valid URL"),
  cvUrl: z
    .string()
    .url("CV must be a valid URL")
    .refine(
      (url) => {
        const cleanUrl = url.split("?")[0].toLowerCase();
        return cleanUrl.endsWith(".pdf");
      },
      {
        message: "CV must be a valid PDF file",
      },
    ),

  // status: z.enum(["PENDING", "ACCEPTED", "REJECTED"]).optional(),
  status: z.enum(JobApplicationStatus).optional(),

  feedback: z
    .string()
    .max(1000, "Feedback must not exceed 1000 characters")
    .nullable()
    .optional(),
});

export const JobApplicationValidation = {
  createJobApplicationZodSchema,
};
