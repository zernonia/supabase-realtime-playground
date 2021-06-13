<template>
  <div class="text-dark-50 mt-10 font-semibold flex flex-row items-center">
    <h5>Hi, love to see you</h5>
    <div class="ml-2 relative">
      <p
        :contenteditable="isEditing"
        @input="updateName"
        class="
          text-green-700
          focus:outline-none
          focus:ring-none
          focus:border-none
        "
        @keydown.enter.prevent="save"
        :class="[isEditing ? 'text-green-500' : '']"
      >
        {{ store.name }}
      </p>
      <div
        v-if="isEditing"
        class="absolute w-full h-0.5 mt-0.5 bg-green-500"
      ></div>
    </div>
    <i-mdi:square-edit-outline
      v-if="!isEditing"
      class="ml-4 cursor-pointer select-none hover:text-white"
      @click="editName"
    ></i-mdi:square-edit-outline>
    <i-mdi:content-save
      v-else
      @click="save"
      class="ml-4 cursor-pointer select-none hover:text-white"
    ></i-mdi:content-save>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue"
import { store } from "../store"
import { supabase } from "../supabase"

export default defineComponent({
  setup() {
    const isEditing = ref(false)
    const newName = ref("")

    const save = async () => {
      isEditing.value = false
      if (newName.value == store.name) return
      const { data, error } = await supabase
        .from("realtime")
        .update({
          name: newName.value,
        })
        .match({
          name: store.name,
        })
      if (error) {
        newName.value = store.name
      } else {
        store.name = newName.value
      }
      store.handleBreak = false
    }

    const editName = () => {
      isEditing.value = true
      store.handleBreak = true
    }
    const updateName = (evt: any) => {
      newName.value = evt.target.innerHTML
    }

    onMounted(() => {
      newName.value = store.name
    })
    return {
      store,
      newName,
      isEditing,
      save,
      editName,
      updateName,
    }
  },
})
</script>
