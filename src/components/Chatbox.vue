<template>
  <div class="z-40" ref="chatboxParent">
    <div class="relative w-74 md:w-auto bg-black bg-opacity-50">
      <div class="w-full h-full relative flex flex-row">
        <div class="w-10 h-10"></div>
        <i-mdi:chat-processing
          class="
            w-10
            h-10
            p-1
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
            py-2
            rounded-lg
            overflow-hidden
            flex flex-row
            item-center
            transition-all
            duration-300
            ease-in-out
            bg-dark-800
          "
          :class="[isExpand ? ' w-60 md:w-64 xl:w-82 !px-2' : 'w-0']"
        >
          <input
            ref="inputEl"
            type="text"
            v-model="msg"
            placeholder="Type here..."
            class="
              pl-2
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
      <p
        v-if="!isExpand && !mobile"
        class="ml-2 opacity-50 absolute top-2 left-full w-32"
      >
        Type "/" to chat
      </p>
      <transition name="slide-up">
        <div
          v-if="isExpand"
          class="
            w-74
            md:w-80
            xl:w-98
            bg-black bg-opacity-50
            absolute
            rounded-lg
            bottom-full
            md:mb-4
            mb-0
            pt-2
            left-0
          "
        >
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
            :class="[chatboxPosition <= 20 ? '' : 'mask']"
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
                  mt-0.5
                  md:mt-2
                  text-xs
                  inline-block
                  rounded-lg
                  font-semibold
                "
                :style="{
                  background: msgItem.realtime_user.color
                    ? msgItem.realtime_user.color
                    : '#10B981',
                }"
              >
                {{ msgItem.realtime_user.name }}
              </p>
              <p class="py-2 px-4 my-2 bg-dark-500 rounded-lg">
                {{ msgItem.message }}
              </p>
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, ref, watch } from "vue"
import { throttledWatch, useIdle, onKeyUp, onClickOutside } from "@vueuse/core"
import { supabase } from "../supabase"
import { store } from "../store"
import { Message } from "../interface"

export default defineComponent({
  props: {
    mobile: Boolean,
  },
  setup() {
    const isExpand = ref(false)
    const inputEl = ref()
    const chatboxEl = ref()
    const chatboxParent = ref()
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
      if (!msg.value) return
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
      isExpand.value = !isExpand.value
      chatboxPing.value = false
      if (isExpand.value) {
        inputEl.value.focus()
      }
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

    onClickOutside(chatboxParent, () => {
      isExpand.value = false
    })

    watch(
      [msgList, isExpand],
      () => {
        nextTick().then(() => {
          const d = chatboxEl.value as HTMLUListElement
          if (d) {
            d.scrollTop = d.scrollHeight
          }
        })
      },
      {
        deep: true,
        immediate: true,
      }
    )

    return {
      isExpand,
      msg,
      msgList,
      inputEl,
      chatboxEl,
      chatboxParent,
      chatboxPosition,
      chatboxPing,
      expandBox,
      insertMsg,
      chatboxScroll,
    }
  },
})
</script>
