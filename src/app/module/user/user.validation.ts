import z from "zod";

export const registerStaffZodSchema = z.object({
  name: z
    .string("Name is required")
    .min(5, "Name must be at least 3 characters")
    .max(30, "Name must be at most 30 characters"),

  email: z.email("Invalid email"),

  phone: z
    .string("Contact number is required")
    .min(11, "Contact number must be at least 11 characters")
    .max(14, "Contact number must be at most 30 characters"),

  // address: z
  //   .string("Address is required")
  //   .min(10, "Address must be at least 10 characters")
  //   .max(100, "Address must be at most 100 characters")
  //   .optional(),

  // experience: z
  //   .int("Experience is required")
  //   .nonnegative("Experience can't be negative"),

  // qualification: z
  //   .string("Qualification is required")
  //   .min(2, "Qualification must be at least 2 characters")
  //   .max(50, "Qualification must be at most 50 characters"),

  // designation: z
  //   .string("Designation is required")
  //   .min(2, "Designation must be at least 2 characters")
  //   .max(50, "Designation must be at most 50 characters"),
});
