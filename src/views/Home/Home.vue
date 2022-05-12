<script>
import { computed, ref, watch } from "vue";
import { useToggle, useDebounceFn } from "@vueuse/core";

import axios from "@/plugins/http.js";
import { socket, useSocketHook } from "@/plugins/socket";

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

    const hasNewPosts = ref(false);
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

    const { onPostCreate } = useSocketHook();
    const getPosts = useDebounceFn(async () => {
      try {
        toggleFetchLoading(true);

        const params = search.value;
        const response = await axios.get("/api/v1/posts", { params });
        posts.value = response.data?.data ?? [];
        hasNewPosts.value = false;
      } catch (e) {
        console.error(e);
      } finally {
        toggleFetchLoading(false);
      }
    }, 500);
    watch(search.value, () => getPosts());
    onPostCreate(() => {
      hasNewPosts.value = true;
    });

    const init = async () => {
      try {
        await getPosts();
        socket.connect();
      } catch (e) {
        console.error(e);
      }
    };

    init();

    return {
      SORT_TYPE,
      search,
      hasNewPosts,
      isFetchLoading,
      normalizedPosts,

      getPosts,
    };
  },
};
</script>

<template src="./Home.html"></template>
<style lang="scss" src="./Home.scss" scoped></style>
