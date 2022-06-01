<script>
import { useRoute, useRouter } from "vue-router";
import axios from "@/plugins/http.js";

import { setUser, setApiToken } from "@/store/user";
import { toggleScreenLoading } from "@/store/screenLoadingStatus";

export default {
  name: "AuthCallback",

  setup() {
    const route = useRoute();
    const router = useRouter();

    const initUser = async () => {
      const { token } = route.query;

      if (!token) {
        router.push({ name: "Login" });
      }

      setApiToken(token);

      try {
        toggleScreenLoading(true);

        const response = await axios.get("/api/v1/user/profile");
        const user = response.data?.data ?? null;
        setUser(user);

        router.push({ name: "Home" });
      } catch (e) {
        console.error(e);
        router.push({ name: "Login" });
      } finally {
        toggleScreenLoading(false);
      }
    };

    initUser();
  },
};
</script>

<template src="./AuthCallback.html"></template>
<style lang="scss" src="./AuthCallback.scss" scoped></style>
