import express from "express";
import { AdminController } from "./admin.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";

const router = express.Router();

router.use(checkAuth(UserRole.ADMIN));

router.post("/append-sp", AdminController.appendSP);
router.post("/register-staff", AdminController.createStaff);
router.patch("/convert-to-sp/:id", AdminController.convertToSP);

export const AdminRoutes = router;
