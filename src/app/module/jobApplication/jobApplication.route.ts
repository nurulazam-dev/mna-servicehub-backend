import express from "express";
import { JobApplicationController } from "./jobApplication.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest.ts";
import { JobApplicationValidation } from "./jobApplication.validation";

const router = express.Router();

router.post(
  "/apply",
  checkAuth(),
  validateRequest(JobApplicationValidation.createJobApplicationZodSchema),
  JobApplicationController.applyToJob,
);

router.get(
  "/",
  checkAuth(UserRole.ADMIN),
  JobApplicationController.getAllApplicationsForAdmin,
);

router.get(
  "/my-applications",
  checkAuth(
    UserRole.JOB_CANDIDATE,
    UserRole.SERVICE_PROVIDER,
    UserRole.CUSTOMER,
  ),
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

router.patch(
  "/update/:id",
  checkAuth(UserRole.ADMIN),
  JobApplicationController.updateApplication,
);

export const JobApplicationRoutes = router;
