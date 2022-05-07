<script>
import { userName } from "@/store/user";

export default {
  name: "Header",

  setup() {
    return {
      userName,
    };
  },
};
</script>

<template src="./Header.html"></template>
<style lang="scss" src="./Header.scss" scoped></style>
