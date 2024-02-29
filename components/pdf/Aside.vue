<template>
  <aside class="col-span-1 flex flex-col gap-5">
    <div class="flex items-center gap-2 text-base">
      <Icon :icon="Logo" class="[&>svg]:w-8" />
      <span class="font-bold">RightsPlus</span>
    </div>

    <div class="flex flex-col" v-for="item in items">
      <span class="text-xs text-neutral-500" v-if="item.label">{{
        $t(item.label)
      }}</span>
      <span class="text-sm whitespace-pre-line">{{ item.value }}</span>
    </div>
  </aside>
</template>

<script setup lang="ts">
import Logo from "~/assets/logo";
defineProps<{
  items: { label?: string; value: string }[];
}>();
</script>