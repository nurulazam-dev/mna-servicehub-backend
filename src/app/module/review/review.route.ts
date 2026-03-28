import express from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest.ts";
import { ReviewValidation } from "./review.validation";
import { ReviewController } from "./review.controller";

const router = express.Router();

router.get("/", ReviewController.getAllReviews);
router.get("/service/:serviceId", ReviewController.getReviewsByService);

router.post(
  "/give-review",
  checkAuth(UserRole.CUSTOMER),
  validateRequest(ReviewValidation.createReviewZodSchema),
  ReviewController.giveReview,
);

router.get(
  "/my-reviews",
  checkAuth(UserRole.CUSTOMER),
  ReviewController.getMyReviews,
);

router.get(
  "/provider-reviews",
  checkAuth(UserRole.SERVICE_PROVIDER),
  ReviewController.getMyReviewsBySP,
);

router.delete(
  "/:id",
  checkAuth(UserRole.ADMIN),
  ReviewController.deleteReviewById,
);

export const ReviewRoutes = router;
