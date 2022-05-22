<script>
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useToggle, useDebounceFn } from "@vueuse/core";
import { format } from "date-fns";

import axios from "@/plugins/http.js";

import { userInfo } from "@/store/user";
import { toggleScreenLoading } from "@/store/screenLoadingStatus";

import SideMenu from "@/components/SideMenu";
import CardSkeleton from "@/components/CardSkeleton";

const ICON_DEFAULT_USER = "https://api.iconify.design/ri:user-5-line.svg";

const SORT_TYPE = {
  ASC: "asc",
  DESC: "desc",
};

export default {
  name: "Personal",
  components: { SideMenu, CardSkeleton },

  setup() {
    const route = useRoute();

    const userId = route.params?.personalId || userInfo.value._id;
    const user = ref(null);

    const isSelf = computed(() => userInfo.value._id === user.value?._id);
    const normalizedUser = computed(() => {
      return {
        ...user.value,
        photoDisplay: user.value?.photo || ICON_DEFAULT_USER,
        followCount: user.value?.followers?.length ?? 0,
      };
    });
    const isFollowing = computed(() => {
      return (
        user.value?.followers.some((follower) => {
          return follower.user._id === userInfo.value._id;
        }) ?? false
      );
    });

    const toggleFollow = async () => {
      try {
        toggleScreenLoading(true);

        await axios({
          method: isFollowing.value ? "delete" : "post",
          url: `/api/v1/user/${userId}/follow`,
        });

        await getUser();
      } catch (e) {
        console.error(e);
      } finally {
        toggleScreenLoading(false);
      }
    };

    const search = ref({
      user: userId,
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
          createdAtDisplay: format(
            new Date(post.createdAt),
            "yyyy-MM-dd HH:mm"
          ),
          likeCount: post?.likes?.length ?? 0,
        };
      });
    });

    const getUser = async () => {
      try {
        const response = await axios.get(`/api/v1/user/profile/${userId}`);
        user.value = response.data?.data ?? null;
      } catch (e) {
        console.error(e);
      }
    };

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

    const updatePostLike = useDebounceFn(async (isLike, postId) => {
      try {
        const updatePost = await axios({
          method: isLike ? "post" : "delete",
          url: `/api/v1/post/${postId}/like`,
        });

        const postIndex = posts.value.findIndex(
          (post) => post._id === updatePost._id
        );

        if (postIndex !== -1) {
          posts.value.splice(postIndex, 1, updatePost);
        }
      } catch (e) {
        console.error(e);
      }
    }, 1000);

    const toggleLike = (postId) => {
      const postIndex = posts.value.findIndex((post) => post._id === postId);

      if (postIndex === -1) {
        return;
      }

      const userId = userInfo.value._id;
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
        await getUser();
        await getPosts();
      } catch (e) {
        console.error(e);
      }
    };

    init();

    return {
      isSelf,
      normalizedUser,
      isFollowing,
      toggleFollow,

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

<template src="./Personal.html"></template>
<style lang="scss" src="./Personal.scss" scoped></style>
