<script>
import { ref } from "vue";
import { userName, userPhoto } from "@/store/user";
import { useToggle } from "@vueuse/core";

import axios from "@/plugins/http.js";

export default {
  name: "InputComment",
  props: {
    postId: {
      type: String,
      required: true,
    },
  },

  setup(props, { emit }) {
    const inputComment = ref("");
    const [isSendMessageLoading, toggleSendMessageLoading] = useToggle(false);

    const sendMessage = async () => {
      if (!inputComment.value) {
        return;
      }

      try {
        toggleSendMessageLoading(true);

        await axios.post(`/api/v1/post/${props.postId}/comment`, {
          comment: inputComment.value,
        });

        const response = await axios.get(`/api/v1/post/${props.postId}`);

        emit("submit", response.data.data);
      } catch (e) {
        console.error(e);
      } finally {
        inputComment.value = "";
        toggleSendMessageLoading(false);
      }
    };

    return {
      userName,
      userPhoto,

      inputComment,
      isSendMessageLoading,
      sendMessage,
    };
  },
};
</script>

<template src="./InputComment.html"></template>
<style lang="scss" src="./InputComment.scss" scoped></style>
