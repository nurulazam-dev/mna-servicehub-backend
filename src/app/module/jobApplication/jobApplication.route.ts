import express from "express";
import { JobApplicationController } from "./jobApplication.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";

const router = express.Router();

router.post("/apply", checkAuth(), JobApplicationController.applyToJob);

router.get(
  "/my-applications",
  checkAuth(),
  JobApplicationController.getMyApplications,
);

router.get(
  "/:id",
  checkAuth(
    UserRole.ADMIN,
    UserRole.JOB_CANDIDATE,
    UserRole.SERVICE_PROVIDER,
    UserRole.CUSTOMER,
  ),
  JobApplicationController.getApplicationById,
);

router.get(
  "/",
  checkAuth(UserRole.ADMIN),
  JobApplicationController.getAllApplicationsForAdmin,
);

router.patch(
  "/update/:id",
  checkAuth(UserRole.ADMIN),
  JobApplicationController.updateApplication,
);

export const JobApplicationRoutes = router;
