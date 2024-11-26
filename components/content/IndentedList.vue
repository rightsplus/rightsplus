<template>
  <ClientOnly>
    <div class="pl-5 -indent-5"><slot /></div>
    <template #fallback>
      <slot />
    </template>
  </ClientOnly>
</template>
<script setup lang="ts"></script>