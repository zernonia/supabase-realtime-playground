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
          z-30
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
        <span
          v-if="chatboxPing"
          class="absolute right-0 flex h-3 w-3 shadow-xl"
        >
          <span
            class="relative inline-flex rounded-full h-3 w-3 bg-green-500"
          ></span>
        </span>
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
          :class="[isExpand ? ' w-82' : 'w-0']"
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
      <p v-if="!isExpand" class="ml-2 opacity-50 absolute top-2 left-full w-32">
        Type "/" to chat
      </p>
      <div class="absolute bottom-full mb-4 left-0 w-98">
        <ul
          id="chatbox"
          ref="chatboxEl"
          class="
            max-h-64
            overflow-y-scroll
            transition-all
            duration-300
            ease-in-out
            transform
          "
          :class="[
            chatboxPosition <= 20 ? '' : 'mask',
            isExpand ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-32',
          ]"
          @scroll="chatboxScroll"
        >
          <li
            class="mr-2"
            v-for="(msgItem, index) in msgList"
            :class="[msgItem.id ? '' : 'opacity-50']"
            :key="msgItem.id"
          >
            <p
              v-if="msgList[index].name_id != msgList[index - 1]?.name_id"
              class="
                px-4
                py-2
                mt-2
                text-xs
                inline-block
                rounded-xl
                font-semibold
              "
              :class="[msgItem.realtime_user.color ? bgColor : 'bg-green-500']"
            >
              {{ msgItem.realtime_user.name }}
            </p>
            <p class="py-3 px-4 my-2 bg-dark-500 rounded-xl">
              {{ msgItem.message }}
            </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, ref, watch } from "vue"
import { throttledWatch, useIdle, onStartTyping, onKeyUp } from "@vueuse/core"
import { supabase } from "../supabase"
import { store } from "../store"
import { Message } from "../interface"

export default defineComponent({
  setup() {
    const isExpand = ref(false)
    const inputEl = ref()
    const chatboxEl = ref()
    const chatboxPosition = ref(0)
    const chatboxPing = ref(false)
    const msg = ref("")
    const msgList = ref<Message[]>([])

    const { idle } = useIdle(500, {
      events: ["keydown"],
    })

    const upsertTyping = async () => {
      await supabase.from("realtime_user").upsert([
        {
          id: store.id,
          message: msg.value,
        },
      ])
    }
    const insertMsg = async () => {
      const temp = msg.value
      msg.value = ""
      msgList.value.push({
        name_id: store.id,
        realtime_user: {
          name: store.name,
          color: store.color,
        },
        message: temp,
      })
      await supabase.from("realtime_chat").insert([
        {
          name_id: store.id,
          message: temp,
        },
      ])
    }

    const chatboxScroll = (e: any) => {
      chatboxPosition.value = e.srcElement.scrollTop
    }

    const listenChatbox = supabase
      .from("realtime_chat")
      .on("*", () => {
        fetchMsg()
        if (!isExpand.value) {
          chatboxPing.value = true
        }
      })
      .subscribe()

    // Typing Event

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
      chatboxPing.value = false
      isExpand.value = !isExpand.value
    }

    onKeyUp("Escape", () => {
      if (!isExpand.value) return
      isExpand.value = false
    })
    onKeyUp("/", () => {
      isExpand.value = true
      chatboxPing.value = false
      if (!inputEl.value.active) inputEl.value.focus()
    })

    const fetchMsg = async () => {
      const { data } = await supabase
        .from<Message>("realtime_chat")
        .select("*, realtime_user(name, color)")
      msgList.value = data ? data : []
    }
    onMounted(() => {
      fetchMsg()
      upsertTyping()
    })

    watch(
      [msgList, isExpand],
      () => {
        const d = chatboxEl.value as HTMLUListElement
        nextTick().then(() => {
          d.scrollTop = d.scrollHeight
        })
      },
      {
        deep: true,
      }
    )

    // Style username
    const bgColor = (color: string) => {
      switch (color) {
        case "blue":
          return "bg-blue-500"
        case "green":
          return "bg-green-500"
        case "dark":
          return "bg-dark-500"
        case "red":
          return "bg-red-500"
        case "yellow":
          return "bg-yellow-500"
      }
    }

    return {
      isExpand,
      msg,
      msgList,
      inputEl,
      chatboxEl,
      chatboxPosition,
      chatboxPing,
      expandBox,
      insertMsg,
      chatboxScroll,
      bgColor,
    }
  },
})
</script>
