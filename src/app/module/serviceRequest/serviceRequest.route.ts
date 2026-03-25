import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { ServiceRequestController } from "./serviceRequest.controller";
// import { validateRequest } from "../../middleware/validateRequest.ts";
// import { ServiceRequestValidation } from "./serviceRequest.validation";

const router = Router();

router.post(
  "/apply",
  checkAuth(UserRole.CUSTOMER),
  // validateRequest(ServiceRequestValidation.createServiceRequestZodSchema),
  ServiceRequestController.createServiceRequest,
);

router.get(
  "/my-service-requests",
  checkAuth(UserRole.CUSTOMER),
  ServiceRequestController.getMyServiceRequestByCustomer,
);

router.get(
  "/my-service-requests-sp",
  checkAuth(UserRole.SERVICE_PROVIDER),
  ServiceRequestController.getMyServiceRequestByServiceProvider,
);

export const ServiceRequestRoutes = router;
