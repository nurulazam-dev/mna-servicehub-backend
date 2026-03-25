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

router.get(
  "/:id",
  checkAuth(
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.SERVICE_PROVIDER,
    UserRole.CUSTOMER,
  ),
  ServiceRequestController.getServiceRequestById,
);

router.get(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.MANAGER),
  ServiceRequestController.getAllServiceRequest,
);

router.patch(
  "/cancel/:id",
  checkAuth(UserRole.CUSTOMER),
  ServiceRequestController.cancelServiceRequestByCustomer,
);

export const ServiceRequestRoutes = router;
