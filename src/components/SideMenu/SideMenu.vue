<script>
import { userName, userPhoto } from "@/store/user";

export default {
  name: "SideMenu",

  setup() {
    return {
      userName,
      userPhoto,
    };
  },
};
</script>

<template src="./SideMenu.html"></template>
<style lang="scss" src="./SideMenu.scss" scoped></style>
