import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/Home/Home.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: "Home",
      path: "/",
      component: HomeView,
    },
    {
      name: "PostCreate",
      path: "/posts/create",
      component: () => import("@/views/PostCreate/PostCreate.vue"),
    },
  ],
});

export default router;
