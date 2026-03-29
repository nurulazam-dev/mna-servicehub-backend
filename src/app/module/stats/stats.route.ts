import { Router } from "express";
import { StatsController } from "./stats.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.get(
  "/",
  checkAuth(
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.SERVICE_PROVIDER,
    UserRole.CUSTOMER,
  ),
  StatsController.getDashboardStatsData,
);

export const StatsRoutes = router;
