import { Router } from "express";
import { UserController } from "./user.controller";
import { registerStaffZodSchema } from "./user.validation";
import { validateRequest } from "../../middleware/validateRequest.ts";

const router = Router();

router.post(
  "/register-staff",
  validateRequest(registerStaffZodSchema),
  UserController.registerStaff,
);

export const UserRoutes = router;
