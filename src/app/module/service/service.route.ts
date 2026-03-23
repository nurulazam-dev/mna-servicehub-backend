import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { ServiceController } from "./service.controller";

const router = Router();

router.get("/", ServiceController.getAllServices);
router.get("/:id", ServiceController.getSingleService);
router.post(
  "/create-service",
  checkAuth(UserRole.ADMIN),
  ServiceController.createService,
);

router.patch(
  "/:id",
  checkAuth(UserRole.ADMIN),
  ServiceController.updateService,
);
export const ServiceRoutes = router;
