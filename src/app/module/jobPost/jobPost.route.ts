import express from "express";
import { JobPostController } from "./jobPost.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest.ts";
import { JobPostValidation } from "./jobPost.validation";

const router = express.Router();

router.get("/", JobPostController.getAllJobPosts);
router.get("/:id", JobPostController.getSingleJobPost);

router.post(
  "/create-job-post",
  checkAuth(UserRole.ADMIN),
  validateRequest(JobPostValidation.createJobPostZodSchema),
  JobPostController.createJobPost,
);

router.patch(
  "/:id",
  checkAuth(UserRole.ADMIN),
  JobPostController.updateJobPost,
);

export const JobPostRoutes = router;
