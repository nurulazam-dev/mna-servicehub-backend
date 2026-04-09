import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../../../../generated/prisma/enums";
import { ServiceController } from "./service.controller";
import { validateRequest } from "../../middleware/validateRequest.ts";
import { ServiceValidation } from "./service.validation";

const router = Router();

router.get("/", ServiceController.getAllServices);

router.get("/:id", ServiceController.getSingleService);

router.post(
  "/create-service",
  checkAuth(UserRole.ADMIN),
  validateRequest(ServiceValidation.createServiceZodSchema),
  ServiceController.createService,
);

router.patch(
  "/update/:id",
  checkAuth(UserRole.ADMIN),
  ServiceController.updateService,
);

router.patch(
  "/delete/:id",
  checkAuth(UserRole.ADMIN),
  ServiceController.deleteService,
);

export const ServiceRoutes: Router = router;
