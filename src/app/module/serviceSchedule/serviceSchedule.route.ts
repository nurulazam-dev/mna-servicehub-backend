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

router.get(
  "/my-schedules",
  checkAuth(UserRole.SERVICE_PROVIDER),
  ServiceScheduleController.getMySchedules,
);

router.get(
  "/schedule-by-date",
  checkAuth(UserRole.ADMIN, UserRole.MANAGER, UserRole.SERVICE_PROVIDER),
  ServiceScheduleController.getScheduleByDate,
);

router.get(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.MANAGER),
  ServiceScheduleController.getServiceSchedules,
);

router.get(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.MANAGER, UserRole.SERVICE_PROVIDER),
  ServiceScheduleController.getScheduleById,
);

export const ServiceScheduleRoutes = router;
