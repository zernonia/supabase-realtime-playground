<template>
  <main
    class="text-warm-gray-50 h-screen w-screen flex justify-center items-center bg-dot"
    :style="{ cursor: selectedCursor }"
  >
    <div class="flex flex-col items-center mb-12">
      <h1 class="text-2xl md:text-4xl xl:text-6xl font-bold text-center mb-6 md:mb-16">
        Welcome to<br />
        <span
          class="text-4xl md:text-6xl xl:text-8xl animate-shock grad-text bg-gradient-to-r from-green-300 to-green-500"
          >Supabase Realtime + Vue</span
        >
      </h1>
      <PlayButton />
    </div>

    <Settings class="fixed top-6 right-16" />
    <GithubButton class="fixed top-6 right-6 w-8 h-8 opacity-50 hover:opacity-100" />
    <Chatbox :mobile="isMobile" class="fixed bottom-6 left-6" />
    <UserList class="fixed bottom-6 right-6 flex flex-col items-end" :users="currentUser" />
    <Cursor
      v-for="cursor in currentUser"
      :key="cursor.name"
      :x="cursor.x * width"
      :y="cursor.y * height"
      :name="cursor.name"
      :msg="cursor.message"
      :color="cursor.color"
      :mobile="cursor.mobile"
    />
    <ModalLogin v-if="!firstLogin"></ModalLogin>
  </main>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, watch, onBeforeUnmount } from "vue"
import { supabase } from "../supabase"
import { useMouse, throttledWatch, useWindowSize, useIdle, useIntervalFn } from "@vueuse/core"
import { User } from "../interface"
import { store } from "../store"

export default defineComponent({
  name: "App",
  setup() {
    const name = ref("")
    const currentUser = ref<User[]>([])
    const { x, y } = useMouse({ touch: false })
    const { width, height } = useWindowSize()
    const { idle } = useIdle(500, { events: ["mousemove"] })
    const totalIdle = useIdle(1000)

    const selectedCursor = computed(() => {
      return `url("data:image/svg+xml,%3Csvg width='19' height='23' viewBox='0 0 19 23' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2.91113 0.587501C1.803 -0.276499 0.1875 0.513251 0.1875 1.91725V21.0524C0.1875 22.6521 2.20688 23.3541 3.19913 22.0986L7.91288 16.1361C8.0868 15.9164 8.30822 15.7389 8.56053 15.6169C8.81285 15.4949 9.0895 15.4317 9.36975 15.4319H17.0783C18.6847 15.4319 19.3834 13.3979 18.1144 12.4124L2.91113 0.586376V0.587501Z' fill='${encodeURIComponent(
        store.color
      )}'/%3E%3Cpath d='M2.91113 0.587501C1.803 -0.276499 0.1875 0.513251 0.1875 1.91725V21.0524C0.1875 22.6521 2.20688 23.3541 3.19913 22.0986L7.91288 16.1361C8.0868 15.9164 8.30822 15.7389 8.56053 15.6169C8.81285 15.4949 9.0895 15.4317 9.36975 15.4319H17.0783C18.6847 15.4319 19.3834 13.3979 18.1144 12.4124L2.91113 0.586376V0.587501Z' stroke='white'/%3E%3C/svg%3E%0A"), default`
    })

    const isMobile = computed(() => {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true
      } else {
        return false
      }
    })

    const upsertData = async () => {
      await supabase.from<User>("realtime_user").upsert([
        {
          id: store.id,
          name: store.name,
          color: store.color,
          x: x.value / width.value,
          y: y.value / height.value,
          online: true,
          mobile: isMobile.value,
          last_active: new Date().toISOString(),
        },
      ])
    }

    const listen = supabase
      .from<User>(`realtime_user`)
      .on("*", (payload) => {
        if (payload.new.id != store.id) {
          // check if user is online
          if (payload.new.online) {
            let i = currentUser.value.findIndex((o: User) => o.id == payload.new.id)
            i == -1 ? currentUser.value.push(payload.new) : (currentUser.value[i] = payload.new)
          } else {
            currentUser.value = currentUser.value.filter((item: User) => item.id != payload.new.id)
          }
        }
      })
      .subscribe()

    onMounted(async () => {
      const { data } = await supabase.from<User>("realtime_user").select("*").eq("online", true).neq("id", store.id)
      currentUser.value = data ? data : []
      upsertData()

      window.addEventListener("beforeunload", () => {
        navigator.sendBeacon(`/api/offline?id=${store.id}`)
      })
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

    watch(
      () => totalIdle.idle,
      (n) => {
        if (n.value) {
          resume()
        } else {
          pause()
        }
      },
      { deep: true }
    )

    const { pause, resume, isActive } = useIntervalFn(async () => {
      /* your function */
      console.log("heart beat")
      await supabase
        .from("realtime_user")
        .update({
          last_active: new Date().toISOString(),
        })
        .match({
          id: store.id,
        })
    }, 30000)

    const firstLogin = ref(false)

    return {
      name,
      currentUser,
      width,
      height,
      isMobile,
      selectedCursor,
      firstLogin,
    }
  },
})
</script>
