<script>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useDebounceFn } from "@vueuse/core";
import { format } from "date-fns";

import axios from "@/plugins/http.js";

import { toggleScreenLoading } from "@/store/screenLoadingStatus";

import SideMenu from "@/components/SideMenu";

const ICON_DEFAULT_USER = "https://api.iconify.design/ri:user-5-line.svg";

export default {
  name: "Likes",
  components: { SideMenu },

  setup() {
    const posts = ref([]);

    const normalizedPosts = computed(() => {
      return posts.value.map((post) => {
        return {
          ...post,
          userName: post?.user?.name ?? "",
          userPhoto: post?.user?.photo || ICON_DEFAULT_USER,
          createdAtDisplay: format(
            new Date(post.createdAt),
            "yyyy-MM-dd HH:mm"
          ),
        };
      });
    });

    const removeLikePost = useDebounceFn(async (postId) => {
      try {
        toggleScreenLoading(true);
        await axios.delete(`/api/v1/post/${postId}/like`);

        const postIndex = posts.value.findIndex((post) => post._id === postId);

        if (postIndex !== -1) {
          posts.value.splice(postIndex, 1);
        }
      } catch (e) {
        console.error(e);
      } finally {
        toggleScreenLoading(false);
      }
    }, 500);

    const getLikePosts = async () => {
      try {
        toggleScreenLoading(true);

        const response = await axios.get("/api/v1/user/like-posts");
        posts.value = response.data?.data ?? [];
      } catch (e) {
        console.error(e);
      } finally {
        toggleScreenLoading(false);
      }
    };

    // 前往個人頁
    const router = useRouter();
    const goPersonalPage = (userId) => {
      router.push({ name: "Personal", params: { personalId: userId } });
    };

    // INIT ********************************************************************
    getLikePosts();
    // INIT ********************************************************************

    return {
      normalizedPosts,
      removeLikePost,
      goPersonalPage,
    };
  },
};
</script>

<template src="./Likes.html"></template>
<style lang="scss" src="./Likes.scss" scoped></style>
