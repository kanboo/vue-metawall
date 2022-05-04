import { useToggle } from "@vueuse/core";

export const [isScreenLoading, toggleScreenLoading] = useToggle(false);
