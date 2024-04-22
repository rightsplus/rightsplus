<template>
  <div
    class="text-sm cursor-pointer text-gray-900 group"
    :class="{
      active: active,
    }"
  >
    <hr
      class="border-b-px border-gray-100 mx-3 duration-750 transition-opacity"
    />

    <div
      class="flex p-3 group-hover:bg-primary-100/50 w-full rounded-lg relative"
      :class="{
        '!bg-primary-100': active,
      }"
    >
      <div class="w-5 flex items-center aspect-square self-start" v-if="unread !== null">
        <Transition name="scale">
          <Badge primary v-if="unread" />
        </Transition>
      </div>

      <slot name="prepend" />
      <div class="flex flex-col gap-3 w-full font-medium">
        <div class="flex flex-col">
          <div class="flex items-center justify-between">
            <span
              class="flex items-center gap-3 text-base leading-none font-bold"
            >
              <span>{{ title }}</span>
            </span>
            <div class="flex flex-col items-end" v-if="date">
              <span class="text-neutral-400 flex items-center gap-2"
                ><span>{{ formatDate(date) }}</span></span
              >
            </div>
          </div>
          <p class="text-neutral-500" v-if="content">{{ content }}</p>
        </div>

        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  active: boolean;
  content?: string;
  date?: string | Date;
  unread?: boolean | null;
  badge?: string;
}>();
</script>

<style lang="scss">
.group {
  &:first-child,
  &.active,
  &.active + *,
  &:hover,
  &:hover + * {
    hr {
      opacity: 0;
    }
  }
}
</style>
