import { Router } from "express";
import { AuthRoutes } from "../module/auth/auth.route";
import { ServiceRoutes } from "../module/service/service.route";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/services", ServiceRoutes);

export const IndexRoutes = router;
