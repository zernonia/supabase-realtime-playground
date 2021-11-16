import { useIdle } from "@vueuse/core"

export const { idle } = useIdle(30 * 1000, { events: ["mousemove", "keydown"] })
