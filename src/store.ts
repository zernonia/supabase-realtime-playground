import { reactive } from "vue"
import { useStorage } from "@vueuse/core"
import { uniqueNamesGenerator, adjectives, names } from "unique-names-generator"
import { randomColor, uuidv4 } from "./function"

export const store = reactive({
  id: useStorage("realtime_id", uuidv4()),
  name: useStorage(
    "realtime_name",
    uniqueNamesGenerator({
      dictionaries: [adjectives, names],
      length: 2,
    })
  ),
  color: useStorage("user_color", randomColor()),
  handleBreak: false,
})
