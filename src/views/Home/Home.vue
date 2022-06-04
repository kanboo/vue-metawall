<script>
import { computed, ref, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useToggle, useDebounceFn } from "@vueuse/core";
import { format } from "date-fns";

import axios from "@/plugins/http.js";
import { socket, useSocketHook } from "@/plugins/socket";

import { userId } from "@/store/user";

import SideMenu from "@/components/SideMenu";
import CardSkeleton from "@/components/CardSkeleton";
import InputComment from "@/components/InputComment";
import IconLoading from "@/components/IconLoading";

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
    InputComment,
    IconLoading,
  },

  setup() {
    // 貼文 *********************************************************************
    const infiniteWrap = ref(null);
    const search = ref({
      timeSort: SORT_TYPE.DESC,
      keyword: "",
    });
    const currentPage = ref(1);
    const posts = ref([]);
    const paginator = ref(null);

    const hasNewPosts = ref(false);
    const [isFetchLoading, toggleFetchLoading] = useToggle(true);

    const isFirstFetchLoading = computed(() => {
      return isFetchLoading.value && currentPage.value === 1;
    });

    const callbackInfinite = (entries) => {
      if (!entries[0].isIntersecting) {
        return;
      }

      const hasNextPage = paginator.value?.hasNextPage ?? false;
      if (!hasNextPage) {
        return;
      }

      currentPage.value += 1;
      getPosts();
    };

    // infinite IO option
    const option_infinite = {
      root: null,
      rootMargin: "-900px 0px 900px 0px",
      threshold: [0],
    };

    // infinite create IO
    const observerInfinite = new IntersectionObserver(
      callbackInfinite,
      option_infinite
    );

    const normalizedPosts = computed(() => {
      return posts.value.map((post) => {
        const comments = post.comments.map((item) => {
          return {
            _id: item._id,
            userName: item.user.name,
            userPhoto: item.user.photo,
            comment: item.comment,
            createdAtDisplay: format(
              new Date(item.createdAt),
              "yyyy-MM-dd HH:mm"
            ),
          };
        });

        return {
          ...post,
          comments,
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

    const { onPostCreate } = useSocketHook();
    const getPosts = useDebounceFn(async () => {
      try {
        toggleFetchLoading(true);
        observerInfinite.unobserve(infiniteWrap.value);

        const params = {
          ...search.value,
          page: currentPage.value,
        };
        const response = await axios.get("/api/v1/posts", { params });
        const newData = response.data?.data?.data ?? [];
        posts.value = [...posts.value, ...newData];
        paginator.value = response.data?.data?.paginator ?? null;
      } catch (e) {
        console.error(e);
      } finally {
        toggleFetchLoading(false);

        nextTick(() => {
          observerInfinite.observe(infiniteWrap.value);
        });
      }
    }, 500);

    const loadLatestPosts = () => {
      hasNewPosts.value = false;
      currentPage.value = 1;
      posts.value = [];
      getPosts();
    };

    watch(search.value, () => {
      currentPage.value = 1;
      posts.value = [];
      getPosts();
    });

    onPostCreate((payload) => {
      console.log("onPostCreate", payload);
      hasNewPosts.value = true;
    });
    // 貼文 *********************************************************************

    // 按讚 *********************************************************************
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

      const matchPost = posts.value[postIndex];
      const likeIdx = matchPost.likes.findIndex((id) => id === userId.value);

      if (likeIdx === -1) {
        matchPost.likes.push(userId.value);
        updatePostLike(true, postId);
      } else {
        matchPost.likes.splice(likeIdx, 1);
        updatePostLike(false, postId);
      }
    };
    // 按讚 *********************************************************************

    // 留言 *********************************************************************
    const updatePostComment = async (updatePost) => {
      const postIndex = posts.value.findIndex(
        (post) => post._id === updatePost._id
      );

      if (postIndex !== -1) {
        posts.value.splice(postIndex, 1, updatePost);
      }
    };
    // 留言 *********************************************************************

    // 前往個人頁
    const router = useRouter();
    const goPersonalPage = (id) => {
      router.push({ name: "Personal", params: { personalId: id } });
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
      infiniteWrap,
      search,
      hasNewPosts,
      isFetchLoading,
      isFirstFetchLoading,
      normalizedPosts,

      getPosts,
      loadLatestPosts,
      toggleLike,

      updatePostComment,

      goPersonalPage,
    };
  },
};
</script>

<template src="./Home.html"></template>
<style lang="scss" src="./Home.scss" scoped></style>
