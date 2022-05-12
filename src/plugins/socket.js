import { io } from "socket.io-client";
import { onUnmounted } from "vue";
import { createEventHook } from "@vueuse/core";

/**
 * 新增貼文通知 Hook
 */
const hookPostCreate = createEventHook();
export const triggerPostCreate = hookPostCreate.trigger;

const onPostCreate = (handlePostCreate) => {
  const { off } = hookPostCreate.on(handlePostCreate);
  onUnmounted(() => off());
};

/**
 * Socket
 */
export const socket = io(import.meta.env.VITE_BACKEND_HOST, {
  transports: ["websocket", "polling"],
  autoConnect: false,
});

socket.on("connect", () => {
  console.log("connect", socket.id);
  socket.on("post:create", triggerPostCreate);
});

socket.on("disconnect", () => {
  console.log("disconnect", socket.id); // undefined
});

socket.on("connect_error", (err) => {
  console.log("connect_error", err);
  // 如果連接異常，修改 transports 傳輸方式
  socket.io.opts.transports = ["polling", "websocket"];
});

/** 只能放在 setup() 裡面用 */
export const useSocketHook = () => {
  return {
    onPostCreate,
  };
};
