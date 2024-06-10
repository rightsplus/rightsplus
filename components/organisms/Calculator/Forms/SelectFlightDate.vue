<template>
  <div class="flex flex-col">
    <InputCalendar
      v-model="modelValue.date"
      @select="() => $emit('select')"
      @update:page="pages = $event"
      :minDate="minDate"
    />
    <TransitionExpand :show="showNotice">
      <div class="flex gap-3 items-start mt-5">
        <FontAwesomeIcon icon="calendar-xmark" class="text-lg shrink-0 text-orange-500" />
        <div class="grid items-start gap-1">
          <p class="text-sm font-bold leading-snug">
            Flüge vor dem {{ minDate.toLocaleDateString() }} sind verjährt.
          </p>
          <p class="text-xs text-gray-500 font-medium leading-snug">
            Die Verjährungsfrist läuft am letzten Tag des dritten Jahres ab (zum
            Beispiel läuft die Verjährungsfrist für einen Flug am 15.6.2019 am
            31.12.2022 ab).
          </p>
        </div>
      </div></TransitionExpand
    >
  </div>
</template>

<script setup lang="ts">
import type { ClaimsForm } from "@/types";
import type { Page } from "v-calendar/dist/types/src/utils/page.js";
import TransitionExpand from "@/components/molecules/TransitionExpand.vue";
const props = defineProps<{
  modelValue: ClaimsForm;
}>();
const minDate = computed(() => new Date(new Date().getFullYear() - 3, 0));
const pages = ref<Page[]>([]);
const showNotice = computed(() => {
  return pages.value.some(
    (e) =>
      e.year === minDate.value.getFullYear() &&
      e.month === minDate.value.getMonth() + 1
  );
});
onMounted(() => {
  // props.modelValue.date = null
});
</script>
