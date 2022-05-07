import { computed, ref } from "vue";

const user = ref(null);
const apiToken = ref(localStorage.getItem("api_token") ?? null);

export const userName = computed(() => {
  return user.value?.name ?? "";
});

export const isLoggedIn = computed(() => {
  return !!user.value?.name && !!apiToken.value;
});

export const setUser = (payload) => {
  const { name, photo } = payload;
  user.value = { name, photo };
};

export const setApiToken = (token) => {
  apiToken.value = token;
  localStorage.setItem("api_token", token);
};
