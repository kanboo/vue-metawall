<script>
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

import ScreenLoading from "@/components/ScreenLoading";
import HeaderLayout from "@/layouts/Header";

import { isScreenLoading } from "@/store/screenLoadingStatus";

export default {
  components: {
    ScreenLoading,
    HeaderLayout,
  },

  setup() {
    const route = useRoute();

    const isExcludeLayout = ref(false);
    watch(
      () => route.meta,
      async (meta) => {
        isExcludeLayout.value = meta?.isExcludeLayout || false;
      }
    );

    const isShowLayout = computed(() => !isExcludeLayout.value);

    return {
      isScreenLoading,
      isShowLayout,
    };
  },
};
</script>

<template>
  <ScreenLoading v-show="isScreenLoading" />
  <HeaderLayout v-show="isShowLayout" />
  <RouterView />
</template>

<style lang="scss" scoped></style>
