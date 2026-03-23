import { Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post("/register", AuthController.registerCustomer);

router.post("/verify-email", AuthController.verifyEmail);

router.post("/login", AuthController.loginUser);
router.post(
  "/logout",
  checkAuth(
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.SERVICE_PROVIDER,
    UserRole.JOB_CANDIDATE,
    UserRole.CUSTOMER,
  ),
  AuthController.logoutUser,
);

router.get(
  "/me",
  checkAuth(
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.SERVICE_PROVIDER,
    UserRole.JOB_CANDIDATE,
    UserRole.CUSTOMER,
  ),
  AuthController.getMe,
);

router.post("/refresh-token", AuthController.getNewToken);

export const AuthRoutes = router;
