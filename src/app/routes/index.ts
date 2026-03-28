import { Router } from "express";
import { AuthRoutes } from "../module/auth/auth.route";
import { ServiceRoutes } from "../module/service/service.route";
import { JobPostRoutes } from "../module/jobPost/jobPost.route";
import { JobApplicationRoutes } from "../module/jobApplication/jobApplication.route";
import { ServiceRequestRoutes } from "../module/serviceRequest/serviceRequest.route";
import { ServiceScheduleRoutes } from "../module/serviceSchedule/serviceSchedule.route";
import { PaymentRoutes } from "../module/payment/payment.route";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/services", ServiceRoutes);
router.use("/job-posts", JobPostRoutes);
router.use("/job-applications", JobApplicationRoutes);
router.use("/service-requests", ServiceRequestRoutes);
router.use("/service-schedules", ServiceScheduleRoutes);
router.use("/payments", PaymentRoutes);

export const IndexRoutes = router;
