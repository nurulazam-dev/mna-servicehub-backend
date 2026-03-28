import { z } from "zod";

const createReviewZodSchema = z.object({
  requestId: z
    .string({ error: "Service request ID is required" })
    .uuid("Invalid service request ID"),

  serviceId: z
    .string({ error: "Service ID is required" })
    .uuid("Invalid service ID"),

  providerId: z
    .string({ error: "Provider ID is required" })
    .uuid("Invalid provider ID"),

  rating: z
    .number({ error: "Rating is required" })
    .int("Rating must be an integer")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot be more than 5"),

  comment: z
    .string({ error: "Comment is required" })
    .min(3, "Comment must be at least 3 characters")
    .max(1000, "Comment cannot exceed 1000 characters"),
});

export const ReviewValidation = {
  createReviewZodSchema,
};
