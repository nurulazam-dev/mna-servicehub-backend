import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { ServiceScheduleController } from "./serviceSchedule.controller";
import { validateRequest } from "../../middleware/validateRequest.ts";
import { ServiceScheduleValidation } from "./serviceSchedule.validation";

const router = Router();

router.post(
  "/create-schedule",
  checkAuth(UserRole.SERVICE_PROVIDER),
  validateRequest(ServiceScheduleValidation.createServiceScheduleZodSchema),
  ServiceScheduleController.createServiceSchedule,
);

export const ServiceScheduleRoutes = router;
