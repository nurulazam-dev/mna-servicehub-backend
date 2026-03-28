import { Router } from "express";
import { UserController } from "./user.controller";
import { registerStaffZodSchema } from "./user.validation";
import { validateRequest } from "../../middleware/validateRequest.ts";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/register-staff",
  checkAuth(UserRole.ADMIN),
  validateRequest(registerStaffZodSchema),
  UserController.registerStaff,
);

export const UserRoutes = router;
