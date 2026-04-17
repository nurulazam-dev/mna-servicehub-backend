import { Router } from "express";
// import { validateRequest } from "../../middleware/validateRequest.ts";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../../../../generated/prisma/enums";
import { ServiceProviderController } from "./serviceProvider.controller.js";

const router = Router();

router.get(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.MANAGER),
  ServiceProviderController.getAllServiceProviders,
);

router.get(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.MANAGER),
  ServiceProviderController.getServiceProviderById,
);

/* router.patch(
  "/:id",
  checkAuth(
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.SERVICE_PROVIDER,
    UserRole.CUSTOMER,
  ),
  UserController.updateUserById,
); */

export const ServiceProviderRoutes: Router = router;
