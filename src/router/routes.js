import HomeView from "@/views/Home";

export default [
  {
    name: "Home",
    path: "/",
    component: HomeView,
  },
  {
    name: "Login",
    path: "/login",
    component: () => import("@/views/Login"),
    meta: { requiresAuth: false, isExcludeLayout: true },
  },
  {
    name: "Register",
    path: "/register",
    component: () => import("@/views/Register"),
    meta: { requiresAuth: false, isExcludeLayout: true },
  },
  {
    name: "Profile",
    path: "/profile",
    component: () => import("@/views/Profile"),
  },
  {
    name: "Likes",
    path: "/likes",
    component: () => import("@/views/Likes"),
  },
  {
    name: "PostCreate",
    path: "/posts/create",
    component: () => import("@/views/PostCreate"),
  },
];
