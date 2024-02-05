<template>
  <div class="flex flex-col gap-2">
    <div class="flex">
      <FontAwesomeIcon
        v-for="n in stars"
        :key="n"
        icon="star"
        class="text-base"
        :class="n > rating ? 'text-gray-200' : 'text-yellow-500'"
      />
    </div>

    <span v-if="label" class="text-sm leading-none text-gray-500">{{
      label
    }}</span>
    <span v-else class="sr-only">{{ rating }} Sterne Bewertung</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  rating: number;
  label?: string;
  stars?: number;
}
withDefaults(defineProps<Props>(), {
  stars: 5
});
</script>
