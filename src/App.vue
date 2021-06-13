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
            to-green-500
          "
          >Supabase Realtime + Vue</span
        >
      </h1>
      <PlayButton />
      <UserChangeName />
    </div>

    <GithubButton
      class="fixed top-6 right-6 w-8 h-8 opacity-50 hover:opacity-100"
    />
    <Chatbox class="fixed bottom-6 left-6" />
    <UserList
      class="fixed bottom-6 right-6 flex flex-col items-end"
      :users="currentUser"
    />
    <Cursor
      v-for="cursor in currentUser"
      :key="cursor.name"
      :x="cursor.x * width"
      :y="cursor.y * height"
      :msg="cursor.message"
    />
  </main>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted } from "vue"
import { supabase } from "./supabase"
import { useMouse, throttledWatch, useWindowSize, useIdle } from "@vueuse/core"
import { User } from "./interface"
import { store } from "./store"

export default defineComponent({
  name: "App",
  setup() {
    const name = ref("")
    const currentUser = ref<User[]>([])
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

    const upsertData = async () => {
      await supabase.from<User>("realtime").upsert([
        {
          name: store.name,
          x: x.value / width.value,
          y: y.value / height.value,
          online: true,
        },
      ])
    }

    const listen = supabase
      .from<User>(`realtime`)
      .on("*", (payload) => {
        if (payload.new.name != store.name) {
          // check if user is online
          console.log(payload.new)
          if (payload.new.online) {
            let i = currentUser.value.findIndex(
              (o: User) => o.name == payload.new.name
            )
            i == -1
              ? currentUser.value.push(payload.new)
              : (currentUser.value[i] = payload.new)
          } else {
            currentUser.value = currentUser.value.filter(
              (item: User) => item.name != payload.new.name
            )
          }
        }
      })
      .subscribe()

    onMounted(async () => {
      const { data } = await supabase
        .from<User>("realtime")
        .select("*")
        .eq("online", true)
        .neq("name", store.name)
      currentUser.value = data ? data : []
      upsertData()
      document.addEventListener("visibilitychange", function () {
        if (document.visibilityState == "hidden") {
          navigator.sendBeacon(`/api/offline?name=${store.name}`)
        } else if (document.visibilityState == "visible") {
          upsertData()
        }
      })
      if (isMobile.value) {
      }
    })

    throttledWatch(
      [x, y, idle],
      () => {
        if (!isMobile.value && !store.handleBreak) {
          upsertData()
        }
      },
      { throttle: 500 }
    )

    return {
      name,
      currentUser,
      width,
      height,
      isMobile,
    }
  },
})
</script>
