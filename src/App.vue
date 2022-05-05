<script>
import { RouterView } from "vue-router";

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
      RouterView,
      isScreenLoading,
    };
  },
};
</script>

<template>
  <ScreenLoading v-show="isScreenLoading" />
  <Default />
  <RouterView />
</template>

<style lang="scss" scoped></style>
