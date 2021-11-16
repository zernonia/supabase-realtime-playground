<template>
  <div
    class="fixed transition-all duration-500 ease-in-out text-white"
    v-if="!mobile"
    :style="{ left: x + 'px', top: y + 'px' }"
  >
    <div class="relative">
      <svg
        width="1.5em"
        height="1.5em"
        viewBox="0 0 24 24"
        class="stroke-2"
        :style="{ stroke: color ? color : '#10B981' }"
      >
        <g fill="none">
          <path
            d="M7.921 2.3C6.936 1.532 5.5 2.234 5.5 3.482v17.009c0 1.422 1.795 2.046 2.677.93l4.19-5.3a1.65 1.65 0 0 1 1.295-.626h6.852c1.428 0 2.049-1.808.921-2.684L7.921 2.299z"
            fill="currentColor"
          ></path>
        </g>
      </svg>

      <div
        ref="box"
        class="text-white ml-3 px-4 py-2 transition-all ease-in-out duration-300 shadow-md rounded-lg max-w-64"
        :style="{ background: color ? color : '#10B981' }"
      >
        <div class="flex items-center">
          <img class="w-6 h-6 rounded-full mr-2" v-if="image" :src="image" />
          <p class="text-xs font-semibold">{{ name }}</p>
        </div>
        <p v-if="msg">
          {{ msg }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ref, toRefs } from "vue"

export default {
  name: "FluentCursor24Filled",
  props: {
    x: Number,
    y: Number,
    name: String,
    msg: String,
    color: String,
    mobile: Boolean,
    image: String,
  },
  setup(prop: any) {
    const { color } = toRefs(prop)
    const box = ref()

    const bgColor = computed(() => {
      switch (color.value) {
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
    })
    const cursorColor = computed(() => {
      switch (color.value) {
        case "blue":
          return "stroke-blue-500"
        case "green":
          return "stroke-green-500"
        case "dark":
          return "stroke-dark-500"
        case "red":
          return "stroke-red-500"
        case "yellow":
          return "stroke-yellow-500"
      }
    })
    return {
      box,
      bgColor,
      cursorColor,
    }
  },
}
</script>
