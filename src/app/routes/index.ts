import { Router } from "express";
import { AuthRoutes } from "../module/auth/auth.route";
import { ServiceRoutes } from "../module/service/service.route";
import { JobPostRoutes } from "../module/jobPost/jobPost.route";
import { JobApplicationRoutes } from "../module/jobApplication/jobApplication.route";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/services", ServiceRoutes);
router.use("/job-posts", JobPostRoutes);
router.use("/job-applications", JobApplicationRoutes);

export const IndexRoutes = router;
