<script>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import axios from "@/plugins/http.js";

import { setUser, setApiToken } from "@/store/user";

import IconLoading from "@/components/IconLoading";

import {
  isScreenLoading,
  toggleScreenLoading,
} from "@/store/screenLoadingStatus";

export default {
  name: "Login",

  components: {
    IconLoading,
  },

  setup() {
    const route = useRoute();
    const router = useRouter();

    const formValues = {
      email: "",
      password: "",
    };

    const validationSchema = yup.object({
      email: yup.string().required("請填寫 郵件信箱").email("信箱格式有誤"),
      password: yup.string().required("請填寫 密碼"),
    });

    // Create a form context with the validation schema
    /**
     * userFrom
     *
     * @url https://vee-validate.logaretm.com/v4/api/use-form#api-reference
     */
    const { errors, handleSubmit } = useForm({
      validationSchema,
      initialValues: formValues,
    });

    // No need to define rules for fields
    const { value: email } = useField("email");
    const { value: password } = useField("password");

    const getLoginBtnClass = computed(() => {
      if (!isScreenLoading.value) {
        return [];
      }

      return [
        "opacity-50",
        "cursor-not-allowed",
        "disabled:bg-gray-400",
        "disabled:text-black",
      ];
    });

    const isLoginFailed = ref(false);
    const onSubmit = handleSubmit(async (values) => {
      try {
        toggleScreenLoading(true);
        isLoginFailed.value = false;

        const response = await axios.post("/api/v1/auth/login", values);

        const user = response.data?.data?.user ?? null;
        const token = response.data?.data?.token ?? null;

        setUser(user);
        setApiToken(token);

        const redirectPath = route.query?.redirect ?? "/";
        router.push(redirectPath);
      } catch (e) {
        isLoginFailed.value = true;
        console.error(e);
      } finally {
        toggleScreenLoading(false);
      }
    });

    return {
      errors,
      email,
      password,

      isScreenLoading,
      getLoginBtnClass,

      isLoginFailed,
      onSubmit,
    };
  },
};
</script>

<template src="./Login.html"></template>
<style lang="scss" src="./Login.scss" scoped></style>
