import { z } from "zod";

const nameSchema = z
  .string("Name is required!")
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must not exceed 100 characters");

const emailSchema = z
  .string("Email is required!")
  .email("Invalid email address");

const passwordSchema = z
  .string("Password is required!")
  .min(8, "Password must be at least 8 characters")
  .max(12, "Password must not exceed 12 characters");

const phoneSchema = z
  .string("Phone number is required!")
  .regex(/^\d{11,13}$/, "Phone must be 11-13 digits");

const registerCustomerZodSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema,
});

const registerJobCandidateZodSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema,

  cvUrl: z
    .string("CV url is required!")
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
});

const loginZodSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const changePasswordZodSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),

    newPassword: passwordSchema,
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export const AuthValidation = {
  registerCustomerZodSchema,
  registerJobCandidateZodSchema,
  loginZodSchema,
  changePasswordZodSchema,
};
