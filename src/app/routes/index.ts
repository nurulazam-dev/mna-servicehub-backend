import { Router } from "express";
import { AuthRoutes } from "../module/auth/auth.route";
import { ServiceRoutes } from "../module/service/service.route";
import { JobPostRoutes } from "../module/jobPost/jobPost.route";
import { JobApplicationRoutes } from "../module/jobApplication/jobApplication.route";
import { ServiceRequestRoutes } from "../module/serviceRequest/serviceRequest.route";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/services", ServiceRoutes);
router.use("/job-posts", JobPostRoutes);
router.use("/job-applications", JobApplicationRoutes);
router.use("/service-requests", ServiceRequestRoutes);

export const IndexRoutes = router;
