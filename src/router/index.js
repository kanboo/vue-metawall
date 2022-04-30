import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: "Home",
      path: "/",
      component: () => import("@/views/Home"),
    },
    {
      name: "PostCreate",
      path: "/posts/create",
      component: () => import("@/views/PostCreate"),
    },
  ],
});

export default router;
