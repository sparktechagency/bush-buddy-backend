import { Router } from "express";

import { USER_ROLE } from "../../../core/constants/global.constants";
import auth from "../../../core/middlewares/auth";
import validateRequest from "../../../core/middlewares/validateRequest";
import { patController } from "./pat.controller";
import { patValidator } from "./pat.validation";

const router = Router();

router.put(
  "/create-privacy",
  auth(USER_ROLE.ADMIN),
  validateRequest(patValidator.patValidationSchema),
  patController.createPrivacy
);
router.put(
  "/create-about",
  auth(USER_ROLE.ADMIN),
  validateRequest(patValidator.patValidationSchema),
  patController.createAbout
);
router.put(
  "/create-terms",
  auth(USER_ROLE.ADMIN),
  validateRequest(patValidator.patValidationSchema),
  patController.createTerms
);

router.get(
  "/privacy",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER, USER_ROLE.USER),
  patController.getPrivacy
);
router.get(
  "/about",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER, USER_ROLE.USER),
  patController.getAbout
);
router.get(
  "/terms",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER, USER_ROLE.USER),
  patController.getTerms
);

export const patRouter = router;
