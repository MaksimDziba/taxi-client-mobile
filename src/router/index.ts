import { createRouter, createWebHistory } from "vue-router";

import StorageService from "../service/storage.service.js";

import Auth from "../pages/Auth.vue";
import Shifts from "../pages/Shifts.vue";
import Map from "../pages/Map.vue";
import OrdersClient from "../pages/OrdersClient.vue";
import Registration from "../pages/Registration.vue";
import OrdersDriver from "../pages/OrdersDriver.vue";

const checkAuthentication = async () => {
  const user = (await StorageService.user.get()) || {};
  const token = (await StorageService.token.get()) || "";

  return !!token && !!user;
};

// Пропускает только пользователей, не прошедших авторизацию или регистрацию
const isNotAuth = async (to, from, next) => {
  const isAuthenticated = await checkAuthentication();

  next(!isAuthenticated ? true : { path: "/auth" });
};

// Пропускает только авторизованных пользователей
const isAuth = async (to, from, next) => {
  const isAuthenticated = await checkAuthentication();

  if (isAuthenticated) {
    next(true);
  } else {
    next({
      name: "Auth",
      query: to.query,
    });
  }
};

const routes = [
  {
    path: "/auth",
    name: "Auth",
    component: Auth,
    beforeEnter: isNotAuth,
  },
  {
    path: "/registration",
    name: "Registration",
    component: Registration,
    beforeEnter: isNotAuth,
  },
  {
    path: "/map",
    name: "Map",
    meta: {
      auth: true,
    },
    component: Map,
    beforeEnter: isAuth,
  },
  {
    path: "/order-client",
    name: "OrderClient",
    meta: {
      auth: true,
    },
    component: OrdersClient,
    beforeEnter: isAuth,
  },
  {
    path: "/orders-driver",
    name: "OrdersDriver",
    meta: {
      auth: true,
    },
    component: OrdersDriver,
    beforeEnter: isAuth,
  },
  {
    path: "/shifts",
    name: "Shifts",
    meta: {
      auth: true,
    },
    component: Shifts,
    beforeEnter: isAuth,
  },
  {
    path: '/:pathMatch(.*)*', 
    redirect: {
      name: 'Map',
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
