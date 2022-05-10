<script>
import { computed, ref, watch } from "vue";
import { useToggle, useDebounceFn } from "@vueuse/core";

import axios from "@/plugins/http.js";

import SideMenu from "@/components/SideMenu";
import CardSkeleton from "@/components/CardSkeleton";

const ICON_DEFAULT_USER = "https://api.iconify.design/ri:user-5-line.svg";

const SORT_TYPE = {
  ASC: "asc",
  DESC: "desc",
};

export default {
  name: "Home",

  components: {
    SideMenu,
    CardSkeleton,
  },

  setup() {
    const search = ref({
      timeSort: SORT_TYPE.DESC,
      keyword: "",
    });
    const posts = ref([]);

    const [isFetchLoading, toggleFetchLoading] = useToggle(true);

    const normalizedPosts = computed(() => {
      return posts.value.map((post) => {
        return {
          ...post,
          userName: post?.user?.name ?? "",
          userPhoto: post?.user?.photo || ICON_DEFAULT_USER,
        };
      });
    });

    const getPosts = useDebounceFn(async () => {
      try {
        toggleFetchLoading(true);

        const params = search.value;
        const response = await axios.get("/api/v1/posts", { params });
        posts.value = response.data?.data ?? [];
      } catch (e) {
        console.error(e);
      } finally {
        toggleFetchLoading(false);
      }
    }, 500);
    watch(search.value, () => getPosts(), { immediate: true });

    return {
      SORT_TYPE,
      search,
      isFetchLoading,
      normalizedPosts,
    };
  },
};
</script>

<template src="./Home.html"></template>
<style lang="scss" src="./Home.scss" scoped></style>
