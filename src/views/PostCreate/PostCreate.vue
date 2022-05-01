<script>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

export default {
  name: "PostCreate",

  setup() {
    const router = useRouter();
    const form = ref({
      content: "",
      image: null,
    });

    const displayImage = ref(null);
    watch(
      () => form.value.image,
      (file) => {
        let reader = new FileReader();
        reader.onload = (e) => {
          displayImage.value = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    );

    const onFileChange = (e) => {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;

      form.value.image = files[0];
    };

    const submit = async () => {
      try {
        const fd = new FormData();
        fd.append("user", "626e1a1e06f150686b003e03");
        fd.append("content", form.value.content);

        if (form.value.image) {
          fd.append("image", form.value.image, form.value.image.name);
        }

        await axios.post("/api/posts", fd);

        router.push({ name: "Home" });
      } catch (e) {
        console.error(e);
      }
    };

    return {
      form,
      displayImage,

      onFileChange,
      submit,
    };
  },
};
</script>

<template src="./PostCreate.html"></template>
<style lang="scss" src="./PostCreate.scss" scoped></style>
