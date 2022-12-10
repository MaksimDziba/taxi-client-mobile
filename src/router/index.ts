import { createRouter, createWebHistory } from "vue-router";

import StorageService from "../service/storage.service.js";

import Auth from "../pages/Auth.vue";
import Shifts from "../pages/Shifts.vue";
import MapDriver from "../pages/MapDriver.vue";
import MapClient from "../pages/MapClient.vue";
import OrderClient from "../pages/OrderClient.vue";
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
    path: "/map-driver",
    name: "MapDriver",
    meta: {
      auth: true,
    },
    component: MapDriver,
    beforeEnter: isAuth,
  },
  {
    path: "/map-client",
    name: "MapClient",
    meta: {
      auth: true,
    },
    component: MapClient,
    beforeEnter: isAuth,
  },
  {
    path: "/order-client",
    name: "OrderClient",
    meta: {
      auth: true,
    },
    component: OrderClient,
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
      name: 'Shifts',
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
