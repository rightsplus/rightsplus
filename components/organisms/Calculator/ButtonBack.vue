<template>
  <button
    @click.prevent="showClose ? $emit('close') : $emit('back')"
    class="leading-none text-2xl self-start -mx-2 aspect-square w-10 h-10 flex items-center justify-center focus-ring rounded-lg"
  >
    <FontAwesomeIcon v-show="showClose" icon="xmark" />
    <FontAwesomeIcon v-show="!showClose" icon="arrow-left" />
  </button>
</template>
<script setup lang="ts">
defineProps<{
  showClose?: boolean;
}>();
defineEmits<{
  close: [];
  back: [];
}>();
</script>
