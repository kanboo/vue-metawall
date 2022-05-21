<script>
import { computed, ref, watch } from "vue";
import { useToggle, useDebounceFn } from "@vueuse/core";

import axios from "@/plugins/http.js";
import { socket, useSocketHook } from "@/plugins/socket";

import { userInfo } from "@/store/user";

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
          likeCount: post?.likes?.length ?? 0,
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
    onPostCreate((payload) => {
      console.log("onPostCreate", payload);
      hasNewPosts.value = true;
    });

    const updatePostLike = useDebounceFn(async (isLike, postId) => {
      try {
        const updatePost = await axios({
          method: isLike ? "post" : "delete",
          url: `/api/v1/post/${postId}/like`,
        });

        const postIndex = posts.value.findIndex(
          (post) => post._id === updatePost._id
        );

        if (postIndex === -1) {
          return;
        }

        posts.value.splice(postIndex, 1, updatePost);
      } catch (e) {
        console.error(e);
      }
    }, 1000);

    const toggleLike = (postId) => {
      const postIndex = posts.value.findIndex((post) => post._id === postId);

      if (postIndex === -1) {
        return;
      }

      const userId = userInfo.value.id;
      const matchPost = posts.value[postIndex];
      const likeIdx = matchPost.likes.findIndex((id) => id === userId);

      if (likeIdx === -1) {
        matchPost.likes.push(userId);
        updatePostLike(true, postId);
      } else {
        matchPost.likes.splice(likeIdx, 1);
        updatePostLike(false, postId);
      }
    };

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
      toggleLike,
    };
  },
};
</script>

<template src="./Home.html"></template>
<style lang="scss" src="./Home.scss" scoped></style>
