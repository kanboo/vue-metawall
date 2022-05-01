<script>
import { computed, ref, watch } from "vue";
import axios from "@/plugins/http.js";

const SORT_TYPE = {
  ASC: "asc",
  DESC: "desc",
};

export default {
  name: "Home",

  setup() {
    const search = ref({
      timeSort: SORT_TYPE.DESC,
      keyword: "",
    });
    const posts = ref([]);

    const normalizedPosts = computed(() => {
      return posts.value.map((post) => {
        return {
          ...post,
          userName: post?.user?.name ?? "",
          userPhoto: post?.user?.photo ?? "",
        };
      });
    });

    const getPosts = async () => {
      try {
        const params = search.value;
        const response = await axios.get("/api/posts", { params });
        posts.value = response.data?.data ?? [];
      } catch (e) {
        console.error(e);
      }
    };
    watch(search.value, () => getPosts(), { immediate: true });

    return {
      SORT_TYPE,
      search,
      normalizedPosts,
    };
  },
};
</script>

<template src="./Home.html"></template>
<style lang="scss" src="./Home.scss" scoped></style>
