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
      {{ users?.length ? users?.length + 1 : 1 }}
      {{ users?.length ? "users" : "user" }}
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
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue"
import { User } from "../interface"

export default defineComponent({
  props: {
    users: Object as PropType<User[]>,
  },
  setup() {
    return {}
  },
})
</script>
