<script>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { format, formatDistanceToNowStrict } from "date-fns";

import axios from "@/plugins/http.js";

import { toggleScreenLoading } from "@/store/screenLoadingStatus";

import SideMenu from "@/components/SideMenu";

const ICON_DEFAULT_USER = "https://api.iconify.design/ri:user-5-line.svg";

export default {
  name: "Follow",
  components: { SideMenu },

  setup() {
    const users = ref([]);

    const normalizedUsers = computed(() => {
      return users.value.map((user) => {
        return {
          ...user,
          photoDisplay: user?.photo || ICON_DEFAULT_USER,
          createdAtDisplay: format(
            new Date(user.createdAt),
            "yyyy/MM/dd HH:mm"
          ),
          trackedDays:
            formatDistanceToNowStrict(new Date(user.createdAt), {
              unit: "day",
              roundingMethod: "ceil",
            })?.split(" ")?.[0] ?? 0,
        };
      });
    });

    const getFollowList = async () => {
      try {
        toggleScreenLoading(true);

        const response = await axios.get("/api/v1/user/following-list");
        users.value = response.data?.data ?? [];
      } catch (e) {
        console.error(e);
      } finally {
        toggleScreenLoading(false);
      }
    };

    const router = useRouter();
    const goPersonalPage = (userId) => {
      router.push({ name: "Personal", params: { personalId: userId } });
    };

    // INIT ********************************************************************
    getFollowList();
    // INIT ********************************************************************

    return {
      normalizedUsers,
      goPersonalPage,
    };
  },
};
</script>

<template src="./Follow.html"></template>
<style lang="scss" src="./Follow.scss" scoped></style>
