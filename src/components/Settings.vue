<template>
  <div ref="el">
    <div class="relative">
      <button class="w-8 h-8 p-0.5 opacity-50 hover:opacity-100 focus:outline-none" @click="isEditing = !isEditing">
        <i-topcoat:settings class="w-full h-full" />
      </button>
      <transition name="slide-up">
        <form
          v-if="isEditing"
          class="
            p-4
            absolute
            top-full
            right-0
            flex flex-col
            text-xs
            bg-dark-500
            rounded-xl
            transform
            transition-all
            ease-in-out
            duration-300
          "
        >
          <label class="mr-2 font-semibold" for="name">Name</label>
          <input type="text" v-model="newName" />
          <label class="text-sm mt-2 font-semibold" for="color">Color</label>
          <div class="rounded-full border-2 border-black overflow-hidden my-1 w-8 h-8">
            <input type="color" name="color" v-model="newColor" />
          </div>
          <button
            @click.prevent="save"
            class="btn flex flex-row items-center justify-center mt-2 bg-dark-900 font-semibold rounded-lg text-sm py-2"
          >
            {{ isLoading ? "Updating..." : "Save" }}
            <i-gg:spinner v-if="isLoading" class="ml-2 animate-spin" />
          </button>
        </form>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { onClickOutside } from "@vueuse/core"
import { defineComponent, onMounted, ref, watch } from "vue"
import { store } from "../store"
import { supabase } from "../supabase"

export default defineComponent({
  setup() {
    const isEditing = ref(false)
    const isLoading = ref(false)
    const newName = ref("")
    const newColor = ref("")
    const el = ref(null)

    onClickOutside(el, (e) => (isEditing.value = false))

    const save = async () => {
      isLoading.value = true
      if (newName.value == store.name && newColor.value == store.color) {
        store.handleBreak = false
        isEditing.value = false
        return
      }
      const { data, error } = await supabase
        .from("realtime_user")
        .update({
          name: newName.value,
          color: newColor.value,
        })
        .match({
          id: store.id,
        })
      if (error) {
        newName.value = store.name
        newColor.value = store.color
      } else {
        store.name = newName.value
        store.color = newColor.value
      }
      isEditing.value = false
      isLoading.value = false
    }

    watch(isEditing, (nVal, oVal) => {
      if (nVal) {
        store.handleBreak = true
      } else {
        store.handleBreak = false
      }
    })

    onMounted(() => {
      newName.value = store.name
      newColor.value = store.color
    })

    return {
      store,
      el,
      newName,
      newColor,
      isEditing,
      isLoading,
      save,
    }
  },
})
</script>
