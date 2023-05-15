<template>
  <button
    class="text-base text-gray-500 hover:underline underline-offset-2 flex gap-2 items-center p-2 leading-none"
  >
    <span><FontAwesomeIcon icon="arrow-left" class="text-sm" /></span
    ><span>Zurück</span>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
