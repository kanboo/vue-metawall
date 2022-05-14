import axios from "@/plugins/http.js";
import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";

import { isLoggedIn, userToken, setUser } from "@/store/user";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

/**
 * 適用於
 *  - 身份驗證
 *  - Fetch 全域資訊，如：User 資訊、Store 資訊...等
 *
 * @param to - 即將進入的路由
 * @param from - 從何處進入的路由.
 * @param next - (可選) 可設定前往哪裡的路由
 *
 * @description
 * Vue Router 4 以後，next 已經變非必要選項了，
 * 換句話說
 * router.beforeEach 的回傳值
 *  - true | undefined (預設情況)： 路由可以正常執行。
 *  - false： 路由才會被中斷。
 *  - Router path： 前往該路由
 */
router.beforeEach(async (to) => {
  /**
   * 未登入 & 有 Token => 重新取得 User 資訊
   * 情境：有可能按 F5 重整頁面
   */
  if (!isLoggedIn.value && !!userToken.value) {
    try {
      const response = await axios.get("/api/v1/user/profile");
      setUser(response.data?.data ?? null);
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * 判斷是否需要驗證登入權限
   */
  const requiresAuth = to.meta?.requiresAuth ?? true;

  if (requiresAuth && !isLoggedIn.value) {
    return {
      name: "Login",
      query: { redirect: to.fullPath }, // 保存我们所在的位置，以便以后再来
    };
  }
});

/**
 * 可搭配像是 GA 追蹤一類的工具，來記錄使用者的瀏覽紀錄，
 * 這個 Hook 對於網站行為的分析來說是相當實用的功能。
 */
router.afterEach(() => {
  // sendToAnalytics(to.fullPath);
});

export default router;
