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
  image: useStorage("realtime_image", ""),
  color: useStorage("user_color", randomColor()),
  handleBreak: false,
  loginModal: useStorage("show_login_modal", true),
  loginWithTwitter: useStorage("login_with_twitter", false),
})
