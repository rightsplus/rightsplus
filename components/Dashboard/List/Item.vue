<template>
  <div
    class="flex p-3 text-sm cursor-pointer text-gray-900 hover:bg-primary-100/50 [&+*]:border-t border-t-gray-100"
    :class="{
      'bg-primary-100': active,
    }"
  >
      <slot name="prefix" />
    <div class="flex flex-col gap-3 w-full font-medium">
      <div class="flex flex-col">
        <div class="flex items-center justify-between">
          <span
            class="flex items-center gap-3 text-base leading-none font-bold"
          >
            <span>{{ title }}</span><Badge primary v-if="badge" :content="badge" />
          </span>
          <div class="flex flex-col items-end">
          <span class="text-neutral-400 flex items-center gap-2"
            ><span>{{ formatDate(date) }}</span
            ><FontAwesomeIcon icon="angle-right" class="text-neutral-400"
          /></span>
          <slot name="suffix" />
        </div>
        </div>
        <p class="text-neutral-500">{{ content }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  date: string | Date;
  content: string;
  active: boolean;
  unread: boolean;
  badge?: string;
}>();
</script>

<style scoped></style>
