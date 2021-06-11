<template>
  <div>
    <button
      class="
        flex
        items-baseline
        text-lg
        px-4
        py-1
        rounded-md
        focus:outline-none
      "
    >
      {{ users?.length ? users?.length + offset : offset }}
      {{ users?.length ? "PC users" : "PC user" }}
      <span class="block relative h-3 w-3 flex ml-4">
        <span
          class="
            animate-ping animate-duration-1500
            absolute
            h-full
            w-full
            rounded-full
            bg-green-300
            opacity-75
          "
        ></span>
        <span class="relative h-full w-full rounded-full bg-green-500"></span>
      </span>
    </button>
    <button
      class="
        flex
        items-baseline
        text-lg
        px-4
        py-1
        rounded-md
        focus:outline-none
      "
    >
      (?) mobile user
      <span class="block relative h-3 w-3 flex ml-4">
        <span
          class="
            animate-ping animate-duration-1500
            absolute
            h-full
            w-full
            rounded-full
            bg-red-300
            opacity-75
          "
        ></span>
        <span class="relative h-full w-full rounded-full bg-red-500"></span>
      </span>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue"
import { User } from "../interface"

export default defineComponent({
  props: {
    users: Object as PropType<User[]>,
    offset: {
      type: Number,
      default: 1,
    },
  },
  setup() {
    return {}
  },
})
</script>
