<template>
  <div>
    <button
      role="button"
      @click="scroll"
      class="text-sm flex items-center gap-3 text-neutral-600 hover:text-black !bg-transparent"
    >
      <span
        class="bg-white/50 rounded-full w-6 h-6 inline-flex items-center justify-center left-0 text-sm"
      >
        <ClientOnly><FontAwesomeIcon icon="arrow-down" fixed-width /></ClientOnly> </span
      ><span>Nach unten scrollen</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const props = defineProps<{
  scrollTo?: string
}>()
const scroll = () => {
  const element = props.scrollTo ? document.getElementById(props.scrollTo) : false

  if (element) element.scrollIntoView({behavior: 'smooth'});
}
</script>

<style scoped></style>
