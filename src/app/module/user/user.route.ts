import { Router } from "express";
import { UserController } from "./user.controller";
import { registerStaffZodSchema } from "./user.validation";
import { validateRequest } from "../../middleware/validateRequest.ts";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../../../../generated/prisma/enums";

const router = Router();

router.get(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.MANAGER),
  UserController.getAllUsers,
);

router.get(
  "/customers",
  checkAuth(UserRole.ADMIN, UserRole.MANAGER),
  UserController.getAllCustomers,
);

router.get(
  "/:id",
  checkAuth(
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.SERVICE_PROVIDER,
    UserRole.JOB_CANDIDATE,
    UserRole.CUSTOMER,
  ),
  UserController.getUserById,
);

router.patch(
  "/:id",
  checkAuth(
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.SERVICE_PROVIDER,
    UserRole.CUSTOMER,
  ),
  UserController.updateUserById,
);

router.patch(
  "/update/:id",
  checkAuth(UserRole.ADMIN),
  UserController.adminUpdateUserById,
);

router.patch(
  "/delete/:id",
  checkAuth(UserRole.ADMIN),
  UserController.adminDeleteUserById,
);

router.post(
  "/register-staff",
  checkAuth(UserRole.ADMIN),
  validateRequest(registerStaffZodSchema),
  UserController.registerStaff,
);

export const UserRoutes: Router = router;
