<template>
  <section
    class="
      fixed
      top-0
      left-0
      w-screen
      h-screen
      bg-dark-100 bg-opacity-20
      backdrop-filter backdrop-blur
      flex
      items-center
      justify-center
      z-50
    "
  >
    <div
      class="w-auto h-auto flex flex-col items-center justify-center bg-dark-800 p-8 rounded-lg text-white space-y-4"
    >
      <div class="text-center">
        <h1 class="text-2xl font-bold">Welcome to the</h1>
        <h1 class="text-4xl font-bold">Playground</h1>
      </div>
      <p class="text-gray-300">Continue as ...</p>

      <div class="flex flex-col items-center space-y-2">
        <button
          class="
            w-64
            p-2
            rounded-lg
            bg-dark-300
            inline-flex
            items-center
            justify-center
            focus:outline-none focus:ring focus:ring-dark-100
          "
          @click="store.loginModal = false"
        >
          <i-fluent:guest-24-filled class="mr-2"></i-fluent:guest-24-filled>
          Guest
        </button>
        <button
          class="
            w-64
            p-2
            rounded-lg
            bg-blue-500
            inline-flex
            items-center
            justify-center
            focus:outline-none focus:ring focus:ring-blue-400
          "
          @click="loginTwitter"
        >
          <i-mdi:twitter class="mr-2"></i-mdi:twitter> Twitter
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { store } from "@/store"
import { onMounted, onUnmounted } from "vue"
import { supabase } from "../supabase"

onMounted(() => {
  store.handleBreak = true
})

onUnmounted(() => {
  store.handleBreak = false
})

const loginTwitter = async () => {
  const { user, session, error } = await supabase.auth.signIn({
    provider: "twitter",
  })
  console.log(user, error)
}
</script>
