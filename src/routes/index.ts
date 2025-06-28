import { Router } from "express";

import { chatRouter } from "../app/modules/contextual/chat/chat.routes";

import { adminRoute } from "../app/modules/base/admin/admin.routes";
import { authRouter } from "../app/modules/base/auth/auth.routes";
import { plansOrderRoutes } from "../app/modules/contextual/plansOrder/plansOrder.routes";

import { accountDetailsRoute } from "../app/modules/admin/accountDetails/accountDetails.routes";
import { overviewRouter } from "../app/modules/admin/overview/overview.routes";
import { notificationRoute } from "../app/modules/base/notification/notification.routes";
import { patRouter } from "../app/modules/base/PrivacyAboutTerms/pat.routes";
import { subscriptionsRouter } from "../app/modules/base/subscriptions/subscriptions.routes";
import { userRoute } from "../app/modules/base/user/user.routes";

import { follow_routes } from "../app/modules/contextual/follow/follow.routes";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRouter,
  },
  { path: "/admin", route: adminRoute },
  {
    path: "/user",
    route: userRoute,
  },

  {
    path: "/subscription",
    route: subscriptionsRouter,
  },
  {
    path: "/subscription-order",
    route: plansOrderRoutes,
  },

  {
    path: "/chat",
    route: chatRouter,
  },
  {
    path: "/pat",
    route: patRouter,
  },
  {
    path: "/overview",
    route: overviewRouter,
  },
  {
    path: "/account-details",
    route: accountDetailsRoute,
  },
  {
    path: "/notification",
    route: notificationRoute,
  },

  {
    path: "/follow",
    route: follow_routes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export { moduleRoutes };
export default router;
