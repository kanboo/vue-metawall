<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

export default {
  name: "PostCreate",

  setup() {
    const router = useRouter();
    const form = ref({
      content: "",
      image: "",
    });

    const onFileChange = async (e) => {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;

      try {
        const file = files[0];
        const fd = new FormData();
        fd.append("image", file, file.name);
        const response = await axios.post(
          "https://infinite-wildwood-24756.herokuapp.com/upload-image",
          fd
        );
        form.value.image = response.data?.data?.link ?? "";
      } catch (e) {
        console.error(e);
      }
    };

    const submit = async () => {
      try {
        const postData = {
          user: "626e1a1e06f150686b003e03",
          ...form.value,
        };

        await axios.post(
          "https://infinite-wildwood-24756.herokuapp.com/posts",
          postData
        );

        router.push({ name: "Home" });
      } catch (e) {
        console.error(e);
      }
    };

    return {
      form,

      onFileChange,
      submit,
    };
  },
};
</script>

<template src="./PostCreate.html"></template>
<style lang="scss" src="./PostCreate.scss" scoped></style>
