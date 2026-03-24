import { Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest.ts";
import { AuthValidation } from "./auth.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(AuthValidation.registerCustomerZodSchema),
  AuthController.registerCustomer,
);

router.post(
  "/register-candidate",
  validateRequest(AuthValidation.registerJobCandidateZodSchema),
  AuthController.registerJobCandidate,
);

router.post("/verify-email", AuthController.verifyEmail);

router.post(
  "/login",
  validateRequest(AuthValidation.loginZodSchema),
  AuthController.loginUser,
);

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

router.post("/forger-password", AuthController.forgetPassword);
router.post("/reset-password", AuthController.resetPassword);
router.post(
  "/change-password",
  validateRequest(AuthValidation.changePasswordZodSchema),
  checkAuth(
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.SERVICE_PROVIDER,
    UserRole.JOB_CANDIDATE,
    UserRole.CUSTOMER,
  ),
  AuthController.changePassword,
);
router.post("/refresh-token", AuthController.getNewToken);
router.get("/google/success", AuthController.googleLoginSuccess);
router.get("/oauth/error", AuthController.handleOAuthError);

export const AuthRoutes = router;
