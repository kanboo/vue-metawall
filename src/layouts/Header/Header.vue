<script>
import { userName } from "@/store/user";

export default {
  name: "Header",

  setup() {
    const logout = () => {
      localStorage.removeItem("api_token");

      location.href = "/login";
    };

    return {
      userName,

      logout,
    };
  },
};
</script>

<template src="./Header.html"></template>
<style lang="scss" src="./Header.scss" scoped></style>
