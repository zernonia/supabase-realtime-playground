<template>
  <main
    class="
      text-warm-gray-50
      h-screen
      w-screen
      flex
      justify-center
      items-center
      bg-dot
    "
  >
    <div class="flex flex-col items-center mb-12">
      <h1
        class="
          text-2xl
          md:text-4xl
          xl:text-6xl
          font-bold
          text-center
          mb-6
          md:mb-16
        "
      >
        Welcome to<br />
        <span
          class="
            text-4xl
            md:text-6xl
            xl:text-8xl
            animate-shock
            grad-text
            bg-gradient-to-r
            from-green-300
            to-green-700
          "
          >Supabase Realtime + Vue</span
        >
      </h1>
      <PlayButton />
      <button @click.prevent="deleteName">Delete Name</button>
    </div>

    <GithubButton
      class="fixed top-6 right-6 w-8 h-8 opacity-50 hover:opacity-100"
    />
    <UserList
      class="fixed bottom-6 right-6 flex flex-col items-end"
      :offset="1"
      :users="currentUser"
    />
    <Cursor
      v-for="cursor in currentUser"
      :key="cursor.name"
      :x="cursor.x * width"
      :y="cursor.y * height"
    />
  </main>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted } from "vue"
import Cursor from "./components/Cursor.vue"
import UserList from "./components/UserList.vue"
import PlayButton from "./components/PlayButton.vue"
import GithubButton from "./components/GithubButton.vue"
import { supabase } from "./supabase"
import { useMouse, useNow, useWindowSize, useIdle } from "@vueuse/core"
import { uniqueNamesGenerator, adjectives, names } from "unique-names-generator"
import { User } from "./interface"

export default defineComponent({
  name: "App",
  components: {
    Cursor,
    UserList,
    PlayButton,
    GithubButton,
  },
  setup() {
    const name = ref("")
    const throttle = ref(500)
    const prev = ref(0)
    const currentUser = ref<User[]>([])
    const now = useNow()
    const { x, y } = useMouse({ touch: false })
    const { width, height } = useWindowSize()
    const { idle } = useIdle(500, { events: ["mousemove"] })

    const isMobile = computed(() => {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        return true
      } else {
        return false
      }
    })

    const sessionId = uniqueNamesGenerator({
      dictionaries: [adjectives, names],
      length: 2,
    })

    const throttleCheck = computed(() => {
      if (now.value.getTime() >= prev.value + throttle.value) {
        prev.value = now.value.getTime()
        return true
      } else {
        return false
      }
    })

    const upsertData = async () => {
      await supabase.from<User>("realtime").upsert([
        {
          name: sessionId,
          x: x.value / width.value,
          y: y.value / height.value,
        },
      ])
    }

    const listen = supabase
      .from<User>(`realtime`)
      .on("*", (payload) => {
        if (payload.new.name != sessionId) {
          if (payload.eventType == "INSERT") {
            currentUser.value.push(payload.new)
          } else if (payload.eventType == "DELETE") {
            currentUser.value = currentUser.value.filter(
              (item: User) => item.name != payload.old.name
            )
          } else {
            let i = currentUser.value.findIndex(
              (o: User) => o.name == payload.new.name
            )
            // console.log("Change received!", payload)
            currentUser.value[i] = payload.new
          }
        }
      })
      .subscribe()

    onMounted(async () => {
      prev.value = Date.now()
      const { data } = await supabase.from<User>("realtime").select("*")
      currentUser.value = data ? data : []
      await upsertData()
      if (!isMobile.value) {
        window.addEventListener("beforeunload", deleteName)
      } else {
        // because 'beforeunload' isn't fired on mobile, so using document.visibilityState instead.
        // idk why this doesn't work, somebody sent HELP!
        document.addEventListener("visibilitychange", function () {
          if (document.visibilityState == "hidden") {
            deleteName()
          } else if (document.visibilityState == "visible") {
            upsertData()
          }
        })
      }
    })

    const deleteName = async () => {
      const apiurl = import.meta.env.VITE_SUPABASE_URL as string
      const apikey = import.meta.env.VITE_SUPABASE_KEY as string
      fetch(`${apiurl}/rest/v1/realtime?name=in.%28${sessionId}%29`, {
        method: "DELETE",
        body: JSON.stringify({
          name: sessionId,
        }),
        keepalive: true,
        headers: {
          apikey,
          Authorization: `Bearer ${apikey}`,
        },
      })
    }

    watch([x, y, idle], async () => {
      if (throttleCheck.value && !isMobile.value) {
        await upsertData()
      }
    })

    return {
      name,
      currentUser,
      width,
      height,
      isMobile,
      deleteName,
    }
  },
})
</script>

<style>
.grad-text {
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
}
.bg-dot {
  position: relative;
  background-color: #000;
  --dot-size: 5px;
  --dot-space: 22px;
  background: linear-gradient(90deg, #000 21px, transparent 1%) 50%,
    linear-gradient(#000 21px, transparent 1%) 50%, #045a42;
  background-size: var(--dot-space) var(--dot-space);
}

body {
  cursor: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAYAAACN1PRVAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAF2SURBVHgB7ZavT8NAFMe/HUUUBoGBG+IE8wRTgwBZx7+AwJI5JEVOjR+WhAk0OCY7EhBDIDAkjISaKWAsBdKEAeU9QhMEaa+3Vm2f5NLX9u4+uXv30gIDRxAEgtoJtUOOkSUkcE6924AbcZ+GMBf1sum3UX+9w1H3WvjBBwvLyEoWcknSysM5Op9+lYRVKCIlY0iEyuMFGm9uWXVbpWWM/9XDsXeD+ktL0K1DwtUk4xPJQjiPtEpBq+XTuiU7TknGtHse9p6aaL137N8SEXFjlGUM53GfhLStvJ1OnLAvWYhseaQiY2TKIzUZE1ceqcqYf8pjITNZCOfx4PlKUGiHz3QoYOR0mMYciqOTkf0KIwZfXGUZizZnl3iiGt2exfXXNK2mLLPyJRbt0iSJvwCJcmZNlLA8LlwVUSIZ58fKz7sUrkARKRknen16kcM1WpULRaRkGzMmC7dJ1EAfRB2QrmkUUdDHfk4eiWxkxZ+/qx1qUxgSwTdeGtNuJGLJSwAAAABJRU5ErkJggg==")
      0 0,
    default;
}
</style>
