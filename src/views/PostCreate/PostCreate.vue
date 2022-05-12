<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useToggle } from "@vueuse/core";
import axios from "@/plugins/http.js";

import { socket } from "@/plugins/socket";

import { toggleScreenLoading } from "@/store/screenLoadingStatus";

import SideMenu from "@/components/SideMenu";

export default {
  name: "PostCreate",

  components: {
    SideMenu,
  },

  setup() {
    const router = useRouter();
    const form = ref({
      content: "",
      image: "",
    });

    const [isUploading, toggleUploading] = useToggle();

    const onFileChange = async (e) => {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;

      try {
        toggleUploading(true);

        const file = files[0];
        const fd = new FormData();
        fd.append("image", file, file.name);
        const response = await axios.post("/api/v1/image", fd);
        form.value.image = response.data?.data?.link ?? "";
      } catch (e) {
        console.error(e);
      } finally {
        toggleUploading(false);
      }
    };

    const submit = async () => {
      try {
        if (!form.value.content) return;

        toggleScreenLoading(true);

        const postData = {
          ...form.value,
        };

        const response = await axios.post("/api/v1/post", postData);

        // socket 通知
        socket.emit("post:create", { id: response.data?.data?.id });

        router.push({ name: "Home" });
      } catch (e) {
        console.error(e);
      } finally {
        toggleScreenLoading(false);
      }
    };

    return {
      form,
      isUploading,

      onFileChange,
      submit,
    };
  },
};
</script>

<template src="./PostCreate.html"></template>
<style lang="scss" src="./PostCreate.scss" scoped></style>
