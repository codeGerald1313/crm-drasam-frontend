import { createRouter, createWebHistory } from "vue-router";
import type { RouteLocationNormalized, NavigationGuardNext } from "vue-router";
import HomeView from "../views/HomeView.vue";
import BandejaView from "../views/bandeja/BandejaView.vue";
import ConexionView from "../views/conexion/ConexionView.vue"
import ConfigView from "../views/configuration/ConfigView.vue"
import RoleView from "../views/role/RoleView.vue"
import EditRoleView2 from "../views/role/EditRoleView2.vue"
import ErrorPage from "@/views/error/Error.vue";
import Login from "@/views/auth/LoginView.vue";
import LoginOther from "@/views/auth/LoginView-other.vue";

import ContactoView from "@/views/contacto/ContactoView.vue";
import EquipoView from '@/views/equipo/EquipoView.vue';
import DesktopView from "@/views/desktop/DesktopView.vue";
import { useAuth } from '@/stores/auth';

import { usePermissionsStore } from '@/stores/permissions'

const requireAuth = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const { token, user } = useAuth();
  if (token && user) {
    next();
  } else {
    next("/login");
  }
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/login-other",
      name: "login-other",
      component: LoginOther
    },
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { requireAuth: true },
      beforeEnter: requireAuth
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
      meta: { requireAuth: true },
      beforeEnter: requireAuth
    },
    {
      path: '/bandeja',
      name: 'bandeja',
      component: BandejaView,
      meta: { requireAuth: true },
      beforeEnter: requireAuth
    },
    {
      path: '/contacto',
      name: 'contacto',
      component: ContactoView,
      meta: { requireAuth: true },
      beforeEnter: requireAuth
    },
    {
      path: '/equipo',
      name: 'equipo',
      component: EquipoView,
      meta: { requireAuth: true },
      beforeEnter: requireAuth
    },
    {
      path: '/desktop',
      name: 'desktop',
      component: DesktopView,
      meta: { requireAuth: true },
      beforeEnter: requireAuth
    },
    {
      path: '/conexion',
      name: 'conexion',
      component: ConexionView,
      meta: { requireAuth: true },
      beforeEnter: requireAuth
    },
    {
      path: '/config',
      name: 'config',
      component: ConfigView,
      meta: { requireAuth: true },
      beforeEnter: requireAuth
    },
    {
      path: '/role',
      name: 'role',
      component: RoleView,
      meta: { requireAuth: true },
      beforeEnter: requireAuth
    },
    {
      path: '/edit-role/:id', 
      component: EditRoleView2,
      meta: { requireAuth: true },
      beforeEnter: requireAuth
    },
    {
      path: '/error/', 
      component: ErrorPage,
      meta: { requireAuth: true },
      beforeEnter: requireAuth
    },
  ],
});

router.beforeEach((to, from, next) => {
  const { token, user } = useAuth();

  try {
    const hasPermissionTo = usePermissionsStore().hasPermissionTo;

    // Home
    // if (to.path === "/config" && hasPermissionTo(['quickly_answers']) == false) {
    //   next('/error');
    //   return;
    // }
    // Bandeja
    if (to.path === "/bandeja" && hasPermissionTo(['data']) == false) {
      next('/error');
      return;
    }
    // Contacto
    if (to.path === "/contacto" && hasPermissionTo(['contacts']) == false) {
      next('/error');
      return;
    }
    // Informe
    // else if (to.path === "/config" && hasPermissionTo(['quickly_answers']) == false) {
    //   next('/error');
    //   return;
    // }
    // Equipo
    if (to.path === "/equipo" && hasPermissionTo(['users']) == false) {
      next('/error');
      return;
    }
    // Conexion
    if (to.path === "/conexion" && hasPermissionTo(['conexion']) == false) {
      next('/error');
      return;
    }
    // Roles
    if (to.path === "/role" && hasPermissionTo(['roles']) == false) {
      next('/error');
      return;
    }
    // Configuracion
    if (to.path === "/config" && hasPermissionTo(['quickly_answers']) == false) {
      next('/error');
      return;
    }
  }
  catch (err) {
    // console.log(err);
  }

  if (to.path === "/login") {
    next();
  } else if (to.meta.requireAuth && (!token || !user)) {
    next("/login");
  } else {
    next();
  }

});

export default router;
