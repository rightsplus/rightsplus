<template>
  <div>
    <button
      role="button"
      @click="scroll"
      class="text-sm flex items-center gap-3 text-white hover:white-black !bg-transparent"
    >
      <span
        class="bg-black/50 rounded-full w-6 h-6 inline-flex items-center justify-center left-0 text-sm"
      >
        <FontAwesomeIcon icon="arrow-down" fixed-width/></span
      ><span>{{ $t('scrollDown')}}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const props = defineProps<{
  scrollTo?: string;
}>();
const scroll = () => {
  const element = props.scrollTo
    ? document.getElementById(props.scrollTo)
    : false;

  if (element) element.scrollIntoView({ behavior: "smooth" });
};
</script>

<style scoped></style>
