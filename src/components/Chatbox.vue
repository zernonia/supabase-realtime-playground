<template>
  <div>
    <div class="relative">
      <div
        class="
          border-2 border-white border-opacity-50
          w-full
          h-full
          bg-dark-800
          relative
          rounded-full
          flex flex-row
        "
      >
        <div class="w-10 h-10"></div>
        <i-mdi:chat-processing
          class="
            w-10
            h-10
            p-2
            cursor-pointer
            absolute
            top-0
            left-0
            opacity-50
            hover:opacity-100
          "
          @click="expandBox"
        />
        <div
          class="
            h-10
            overflow-hidden
            flex flex-row
            item-center
            transition-all
            duration-300
            ease-in-out
          "
          :class="[isExpand ? ' w-72' : 'w-0']"
        >
          <input
            ref="inputEl"
            type="text"
            v-model="msg"
            placeholder="Type here..."
            class="
              pl-0
              w-full
              bg-transparent
              placeholder-dark-50
              border-none
              focus:ring-transparent
            "
            @keydown.enter="insertMsg"
          />
          <button
            @click.prevent="insertMsg"
            class="mr-2 opacity-50 hover:opacity-100 focus:outline-none"
          >
            <i-mdi:send class="w-4 h-4" />
          </button>
        </div>
      </div>
      <div class="absolute bottom-full left-0 w-72">
        <ul>
          <li v-for="msgItem in msgList" :key="msgItem.id">
            {{ msgItem.message }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue"
import { throttledWatch, useIdle, onStartTyping } from "@vueuse/core"
import { supabase } from "../supabase"
import { store } from "../store"
import { Message } from "../interface"

export default defineComponent({
  setup() {
    const isExpand = ref(false)
    const inputEl = ref()
    const msg = ref("")
    const msgList = ref<Message[]>([])

    const { idle } = useIdle(500, {
      events: ["keydown"],
    })

    const upsertTyping = async () => {
      await supabase.from("realtime").upsert([
        {
          name: store.name,
          message: msg.value,
        },
      ])
    }
    const insertMsg = async () => {
      const temp = msg.value
      msg.value = ""
      msgList.value.push({
        name: store.name,
        message: temp,
      })
      await supabase.from("realtime_chat").insert([
        {
          name: store.name,
          message: temp,
        },
      ])
    }

    const listenChatbox = supabase
      .from("realtime_chat")
      .on("*", (payload) => {})
      .subscribe()

    throttledWatch(
      [msg, idle],
      () => {
        if (isExpand.value) {
          upsertTyping()
        }
      },
      { throttle: 500 }
    )

    const expandBox = () => {
      inputEl.value.focus()
      isExpand.value = !isExpand.value
    }

    onStartTyping(() => {
      isExpand.value = true
      if (!inputEl.value.active) inputEl.value.focus()
    })

    onMounted(async () => {
      const { data } = await supabase.from<Message>("realtime_chat").select("*")
      msgList.value = data ? data : []
    })

    return {
      isExpand,
      msg,
      msgList,
      inputEl,
      expandBox,
      insertMsg,
    }
  },
})
</script>

<style></style>
