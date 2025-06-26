import { Router } from "express";

import { reviewRouter } from "../app/modules/contextual/review/review.routes";

import { productWishList_routes } from "../app/modules/contextual/_wishlists/productWishList/wishlist.routes";
import { advertiseRouter } from "../app/modules/contextual/advertise/advertise.routes";
import { chatRouter } from "../app/modules/contextual/chat/chat.routes";

import { plansOrderRoutes } from "../app/modules/contextual/plansOrder/plansOrder.routes";

import { product_order_route } from "../app/modules/base/_orders/productOrder/order.route";
import { service_order_route } from "../app/modules/base/_orders/serviceOrder/order.route";
import { adminRoute } from "../app/modules/base/admin/admin.routes";
import { authRouter } from "../app/modules/base/auth/auth.routes";

import { accountDetailsRoute } from "../app/modules/admin/accountDetails/accountDetails.routes";
import { overviewRouter } from "../app/modules/admin/overview/overview.routes";
import { notificationRoute } from "../app/modules/base/notification/notification.routes";
import { patRouter } from "../app/modules/base/PrivacyAboutTerms/pat.routes";
import { subscriptionsRouter } from "../app/modules/base/subscriptions/subscriptions.routes";
import { userRoute } from "../app/modules/base/user/user.routes";
import { productCategoryRoute } from "../app/modules/contextual/_categories/productCategory/productCategory.routes";
import { serviceCatRoute } from "../app/modules/contextual/_categories/ServiceCategory/serviceCategory.routes";
import { serviceWishList_routes } from "../app/modules/contextual/_wishlists/serviceWishList/wishlist.routes";
import { follow_routes } from "../app/modules/contextual/follow/follow.routes";
import { product_route } from "../app/modules/contextual/product/product.route";
import { service_route } from "../app/modules/contextual/service/service.route";

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
    path: "/product",
    route: product_route,
  },

  {
    path: "/service",
    route: service_route,
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
    path: "/review",
    route: reviewRouter,
  },

  {
    path: "/product-cat",
    route: productCategoryRoute,
  },
  {
    path: "/service-cat",
    route: serviceCatRoute,
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
    path: "/advertise",
    route: advertiseRouter,
  },

  {
    path: "/product-wish-list",
    route: productWishList_routes,
  },
  {
    path: "/service-wish-list",
    route: serviceWishList_routes,
  },

  {
    path: "/follow",
    route: follow_routes,
  },

  {
    path: "/product-order",
    route: product_order_route,
  },

  {
    path: "/service-order",
    route: service_order_route,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export { moduleRoutes };
export default router;
