<template>
  <div class="flex flex-col lg:flex-row items-center">
    <button
      @click="addCount('love')"
      class="play-button bg-gradient-to-r from-red-500 to-red-800"
    >
      Love 💘 {{ countLove }}
    </button>
    <button
      @click="addCount('wow')"
      class="
        play-button
        bg-gradient-to-r
        from-yellow-200
        via-yellow-400
        to-yellow-700
        mx-4
      "
    >
      Wow 😲 {{ countWow }}
    </button>
    <button
      @click="addCount('unique')"
      class="play-button bg-gradient-to-r from-fuchsia-600 to-pink-600"
    >
      Unique 🦄 {{ countUnique }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue"
import { supabase } from "../supabase"

export default defineComponent({
  setup() {
    const countLove = ref(0)
    const countWow = ref(0)
    const countUnique = ref(0)

    const addCount = async (name: string) => {
      name == "love"
        ? countLove.value++
        : name == "wow"
        ? countWow.value++
        : name == "unique"
        ? countUnique.value++
        : ""

      await supabase.rpc("realtime_playbutton_addon", {
        a: name,
      })
    }

    const listen = supabase
      .from("realtime_playbutton")
      .on("UPDATE", (payload) => {
        const { count, name } = payload.new
        name == "love"
          ? count > countLove.value
            ? (countLove.value = count)
            : ""
          : name == "wow"
          ? count > countWow.value
            ? (countWow.value = count)
            : ""
          : name == "unique"
          ? count > countUnique.value
            ? (countUnique.value = count)
            : ""
          : ""
      })
      .subscribe()

    onMounted(async () => {
      const { data } = await supabase.from("realtime_playbutton").select("*")
      data
        ? data.map((item: any) => {
            item.name == "love"
              ? (countLove.value = item.count)
              : item.name == "wow"
              ? (countWow.value = item.count)
              : item.name == "unique"
              ? (countUnique.value = item.count)
              : ""
          })
        : ""
    })
    return {
      countLove,
      countWow,
      countUnique,

      addCount,
    }
  },
})
</script>

<style lang="postcss">
.play-button {
  @apply w-62 px-10 py-4 my-1.5 lg:my-0 text-lg lg:text-xl font-semibold select-none rounded-2xl transform transition-all outline-none;
}
.play-button:hover {
  @apply lg:scale-110;
}
.play-button:active {
  @apply scale-95 lg:scale-100 outline-none;
}
.play-button:focus {
  @apply outline-none;
}
</style>
