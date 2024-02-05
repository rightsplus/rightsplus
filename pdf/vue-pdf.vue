<template>
  <div>
    <ReactToVue :component="PDF" :props="{ data }" />
  </div>
</template>

<script setup lang="ts">
import ReactToVue from 'react-to-vue';
import PDF from './react-pdf';
defineProps<{ data: any }>()
</script>
