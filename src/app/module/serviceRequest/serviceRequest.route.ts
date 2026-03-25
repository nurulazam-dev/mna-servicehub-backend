import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { ServiceRequestController } from "./serviceRequest.controller";
import { validateRequest } from "../../middleware/validateRequest.ts";
import { ServiceRequestValidation } from "./serviceRequest.validation";

const router = Router();

router.post(
  "/create-service",
  checkAuth(UserRole.ADMIN),
  validateRequest(ServiceRequestValidation.createServiceRequestZodSchema),
  ServiceRequestController.createServiceRequest,
);

export const ServiceRequestRoutes = router;
