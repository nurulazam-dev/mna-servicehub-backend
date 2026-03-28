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

router.get(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.MANAGER),
  PaymentController.getAllPayments,
);

router.get(
  "/my-payments",
  checkAuth(UserRole.CUSTOMER),
  PaymentController.getMyPaidPayments,
);

router.get(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.MANAGER),
  PaymentController.getSinglePayment,
);

export const PaymentRoutes = router;
