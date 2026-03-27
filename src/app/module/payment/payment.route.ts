import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { PaymentController } from "./payment.controller";

const router = Router();

router.post(
  "/create-payment",
  checkAuth(UserRole.CUSTOMER),
  PaymentController.createPayment,
);

export const PaymentRoutes = router;
