<script>
import { ref } from "vue";

import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import axios from "@/plugins/http.js";

import { userInfo, setUser } from "@/store/user";

import { toggleScreenLoading } from "@/store/screenLoadingStatus";

import IMG_DEFAULT_USER from "@/assets/images/user_default.png";

import SideMenu from "@/components/SideMenu";

export default {
  name: "Profile",

  components: {
    SideMenu,
  },

  setup() {
    const TABES = {
      CHANGE: "change",
      RESET: "reset",
    };

    const activeTab = ref(TABES.CHANGE);

    const changeTab = (tab) => {
      activeTab.value = tab;
    };

    // 更改 User 資料 ***********************************************************
    const GENDER_TYPE = {
      MALE: "male",
      FEMALE: "female",
    };

    const userForm = {
      name: userInfo.value?.name ?? "",
      photo: userInfo.value?.photo ?? "",
      gender: userInfo.value?.gender ?? "",
    };

    const userValidationSchema = yup.object({
      name: yup.string().required("請填寫 名稱").min(2, "名稱最少 2 個字元"),
      gender: yup.string().required("請選擇 性別"),
    });

    const { errors: userFormErrors, handleSubmit: submitUserForm } = useForm({
      validationSchema: userValidationSchema,
      initialValues: userForm,
    });

    const imageValidated = ref(true);
    const { value: photo } = useField("photo");
    const { value: name } = useField("name");
    const { value: gender } = useField("gender");

    const onFileChange = async (e) => {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;

      try {
        const file = files[0];
        const image = new Image();
        image.src = URL.createObjectURL(file);

        await new Promise((resolve, reject) => {
          image.onerror = () => reject();
          image.onload = () => resolve();
        });

        const { width, height } = image;
        if (!(width === height && height >= 300)) {
          imageValidated.value = false;
          return;
        }

        const fd = new FormData();
        fd.append("image", file, file.name);
        const response = await axios.post("/api/v1/image", fd);
        photo.value = response.data?.data?.link ?? "";
        imageValidated.value = true;
      } catch (e) {
        console.error(e);
      }
    };

    const onSubmitUserForm = submitUserForm(async (values) => {
      try {
        toggleScreenLoading(true);

        const response = await axios.patch("/api/v1/user/profile", values);
        const user = response.data?.data ?? null;

        setUser(user);

        // router.push({ name: "Home" });
      } catch (e) {
        console.error(e);
      } finally {
        toggleScreenLoading(false);
      }
    });
    // 更改 User 資料 ***********************************************************

    // 更改 Password ************************************************************
    const passwordForm = {
      newPassword: "",
      confirmPassword: "",
    };

    const passwordValidationSchema = yup.object({
      newPassword: yup
        .string()
        .required("請填寫 密碼")
        .min(4, "密碼最少 4 個字元"),
      confirmPassword: yup
        .string()
        .required("請填寫 確認密碼")
        .oneOf([yup.ref("newPassword"), null], "密碼輸入不一致"),
    });

    const { errors: passwordFormErrors, handleSubmit: submitPasswordForm } =
      useForm({
        validationSchema: passwordValidationSchema,
        initialValues: passwordForm,
      });

    const { value: newPassword } = useField("newPassword");
    const { value: confirmPassword } = useField("confirmPassword");

    const onSubmitPasswordForm = submitPasswordForm(async (values, actions) => {
      try {
        toggleScreenLoading(true);

        await axios.patch("/api/v1/user/update-password", values);
        actions.resetForm();

        // router.push({ name: "Home" });
      } catch (e) {
        console.error(e);
      } finally {
        toggleScreenLoading(false);
      }
    });
    // 更改 Password ************************************************************

    return {
      TABES,
      activeTab,
      changeTab,

      IMG_DEFAULT_USER,
      GENDER_TYPE,
      photo,
      name,
      gender,
      imageValidated,
      userFormErrors,
      onFileChange,
      onSubmitUserForm,

      newPassword,
      confirmPassword,
      passwordFormErrors,
      onSubmitPasswordForm,
    };
  },
};
</script>

<template src="./Profile.html"></template>
<style lang="scss" src="./Profile.scss" scoped></style>
