import { computed, ref } from "vue";

const ICON_DEFAULT_USER = "https://api.iconify.design/ri:user-5-line.svg";

const user = ref(null);
const apiToken = ref(localStorage.getItem("api_token"));

export const userId = computed(() => {
  return user.value?.id ?? "";
});

export const userName = computed(() => {
  return user.value?.name ?? "";
});

export const userPhoto = computed(() => {
  return user.value?.photo || ICON_DEFAULT_USER;
});

export const userToken = computed(() => {
  return apiToken.value;
});

export const isLoggedIn = computed(() => {
  return !!user.value?.name && !!apiToken.value;
});

export const setUser = (payload) => {
  user.value = payload;
};

export const setApiToken = (token) => {
  apiToken.value = token;
  localStorage.setItem("api_token", token);
};
