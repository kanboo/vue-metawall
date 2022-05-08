<script>
import { computed } from "vue";
import { useRouter } from "vue-router";

import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import axios from "@/plugins/http.js";

import { setUser, setApiToken } from "@/store/user";
import apiErrorTypes from "@/constants/apiErrorTypes";

import IconLoading from "@/components/IconLoading";

import {
  isScreenLoading,
  toggleScreenLoading,
} from "@/store/screenLoadingStatus";

export default {
  name: "Register",

  components: {
    IconLoading,
  },

  setup() {
    const router = useRouter();

    const formValues = {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    };

    const validationSchema = yup.object({
      name: yup.string().required("請填寫 名稱").min(2, "名稱最少 2 個字元"),
      email: yup.string().required("請填寫 郵件信箱").email("信箱格式有誤"),
      password: yup
        .string()
        .required("請填寫 密碼")
        .min(4, "密碼最少 4 個字元"),
      confirmPassword: yup
        .string()
        .required("請填寫 確認密碼")
        .oneOf([yup.ref("password"), null], "密碼輸入不一致"),
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
    const { value: name } = useField("name");
    const { value: email } = useField("email");
    const { value: password } = useField("password");
    const { value: confirmPassword } = useField("confirmPassword");

    const getRegisterClass = computed(() => {
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

    const handleEmailBlur = async (e) => {
      // TODO：優化體驗
      console.log("handleEmailBlur", e.target.value);
      // setFieldError("email", "1 - 此 Mail 已被存在！");
    };

    const onSubmit = handleSubmit(async (values, actions) => {
      try {
        toggleScreenLoading(true);

        const response = await axios.post("/api/users/register", values);

        const user = response.data?.data?.user ?? null;
        const token = response.data?.data?.token ?? null;

        setUser(user);
        setApiToken(token);

        router.push({ name: "Home" });
      } catch (e) {
        const errorType = e.response?.data?.errorType ?? null;

        if (errorType === apiErrorTypes.EMAIL_EXISTS) {
          const errorMessage = e.response?.data?.message ?? "此 Mail 已註冊！";
          actions.setFieldError("email", errorMessage);
        } else {
          console.error(e);
        }
      } finally {
        toggleScreenLoading(false);
      }
    });

    return {
      errors,
      name,
      email,
      password,
      confirmPassword,

      isScreenLoading,
      getRegisterClass,

      handleEmailBlur,
      onSubmit,
    };
  },
};
</script>

<template src="./Register.html"></template>
<style lang="scss" src="./Register.scss" scoped></style>
