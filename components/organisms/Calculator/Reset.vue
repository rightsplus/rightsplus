<template>
  <div class="flex flex-col items-center gap-24">
    <div class="text-center">
      <h2 class="text-2xl font-bold">Thank you!</h2>
      <p class="text-gray-500">We will be in touch shortly.</p>
    </div>
    <div class="flex gap-10">
      <button class="button hover:underline underline-offset-2" @click="$emit('back')">
        Back
      </button>
      <button
        class="button hover:underline underline-offset-2"
        @click="$emit('reset')"
      >
        Start Over
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({});
</script>
