<script>
import ScreenLoading from "@/components/ScreenLoading";
import Default from "./layouts/Default";

import { isScreenLoading } from "./store/screenLoadingStatus";

export default {
  components: {
    ScreenLoading,
    Default,
  },

  setup() {
    return {
      isScreenLoading,
    };
  },
};
</script>

<template>
  <ScreenLoading v-show="isScreenLoading" />
  <Default />
  <router-view />
</template>

<style lang="scss" scoped></style>
