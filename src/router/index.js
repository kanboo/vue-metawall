import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/Home";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: "Home",
      path: "/",
      component: HomeView,
    },
    {
      name: "Login",
      path: "/login",
      component: () => import("@/views/Login"),
      meta: { isExcludeLayout: true },
    },
    {
      name: "PostCreate",
      path: "/posts/create",
      component: () => import("@/views/PostCreate"),
    },
  ],
});

export default router;
