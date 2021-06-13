import { reactive } from "vue"
import { useStorage } from "@vueuse/core"
import { uniqueNamesGenerator, adjectives, names } from "unique-names-generator"

export const store = reactive({
  name: useStorage(
    "realtime_name",
    uniqueNamesGenerator({
      dictionaries: [adjectives, names],
      length: 2,
    })
  ),
  handleBreak: false,
})
