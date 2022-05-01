import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/Home";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      name: "Home",
      path: "/",
      component: HomeView,
    },
    {
      name: "PostCreate",
      path: "/posts/create",
      component: () => import("@/views/PostCreate"),
    },
  ],
});

export default router;
