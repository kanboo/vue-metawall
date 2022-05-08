import { computed, ref } from "vue";

const user = ref(null);
const apiToken = ref(localStorage.getItem("api_token"));

export const userId = computed(() => {
  return user.value?.id ?? "";
});

export const userName = computed(() => {
  return user.value?.name ?? "";
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
