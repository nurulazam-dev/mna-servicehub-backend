import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";
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
  "/:id",
  checkAuth(UserRole.ADMIN),
  ServiceController.updateService,
);

export const ServiceRoutes = router;
