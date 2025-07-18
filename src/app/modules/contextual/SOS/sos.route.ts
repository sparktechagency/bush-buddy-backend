import { Router } from "express";
import { USER_ROLE } from "../../../core/constants/global.constants";
import auth from "../../../core/middlewares/auth";
import validateRequest from "../../../core/middlewares/validateRequest";
import { sos_controller } from "./sos.controller";
import { sos_validation } from "./sos.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.USER),
  validateRequest(sos_validation.createSos),
  sos_controller.createSos
);

router.get("/", auth(USER_ROLE.ADMIN, USER_ROLE.USER), sos_controller.getSos);
router.get(
  "/my-sos",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  sos_controller.getMySos
);

router.put(
  "/send-sos-mail",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  sos_controller.sendSosMail
);

router.put(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  validateRequest(sos_validation.updateSos),
  sos_controller.updateSos
);

router.delete(
  "/deactivate-sos/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  sos_controller.deactivateSos
);

export const sos_route = router;
