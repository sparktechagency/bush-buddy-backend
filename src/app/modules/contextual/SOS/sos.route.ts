import { Router } from "express";
import { USER_ROLE } from "../../../core/constants/global.constants";
import auth from "../../../core/middlewares/auth";
import validateRequest from "../../../core/middlewares/validateRequest";
import { sos_controller } from "./sos.controller";
import { sos_validation } from "./sos.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.ADMIN),
  validateRequest(sos_validation.createSos),
  sos_controller.createSos
);

router.put(
  "/:id",
  auth(USER_ROLE.ADMIN),
  validateRequest(sos_validation.updateSos),
  sos_controller.updateSos
);

router.get("/", auth(USER_ROLE.ADMIN, USER_ROLE.USER), sos_controller.getSos);
router.delete("/:id", auth(USER_ROLE.ADMIN), sos_controller.deactivateSos);

export const sos_route = router;
