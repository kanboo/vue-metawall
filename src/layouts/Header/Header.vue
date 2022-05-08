<script>
import { userName, userPhoto } from "@/store/user";

export default {
  name: "Header",

  setup() {
    const logout = () => {
      localStorage.removeItem("api_token");

      location.reload();
    };

    return {
      userName,
      userPhoto,

      logout,
    };
  },
};
</script>

<template src="./Header.html"></template>
<style lang="scss" src="./Header.scss" scoped></style>
