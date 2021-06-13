<template>
  <div
    class="fixed transition-all duration-500 ease-in-out text-white"
    v-if="x && y"
    :style="{ left: x + 'px', top: y + 'px' }"
  >
    <div class="relative">
      <svg
        width="1.5em"
        height="1.5em"
        viewBox="0 0 24 24"
        class="stroke-2"
        :class="[strokeColor]"
      >
        <g fill="none">
          <path
            d="M7.921 2.3C6.936 1.532 5.5 2.234 5.5 3.482v17.009c0 1.422 1.795 2.046 2.677.93l4.19-5.3a1.65 1.65 0 0 1 1.295-.626h6.852c1.428 0 2.049-1.808.921-2.684L7.921 2.299z"
            fill="currentColor"
          ></path>
        </g>
      </svg>
      <div
        v-if="msg"
        class="
          text-white
          bg-dark-400
          ml-6
          px-4
          py-2
          shadow-md
          rounded-2xl
          max-w-64
        "
      >
        {{ msg }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ref } from "vue"

export default {
  name: "FluentCursor24Filled",
  props: {
    x: Number,
    y: Number,
    msg: String,
  },
  setup() {
    const color = computed(() => {
      const r = Math.floor(Math.random() * 5)
      switch (r) {
        case 0:
          return "-green-500"
        case 1:
          return "-blue-500"
        case 2:
          return "-red-500"
        case 3:
          return "-dark-500"
        case 4:
          return "-yellow-500"
        default:
          return "-green-500"
      }
    })

    const bgColor = computed(() => {
      return `bg${color.value}`
    })
    const strokeColor = computed(() => {
      return `stroke${color.value}`
    })

    return {
      bgColor,
      strokeColor,
    }
  },
}
</script>
