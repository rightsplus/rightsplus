<template>
  <div ref="calendar">
    <DatePicker
      :modelValue.string="modelValue"
      @update:modelValue="updateModelValue"
      :masks="{modelValue: 'DD.MM.YYYY'}"
      class="calendar"
      color="orange"
      :step="1"
      :columns="columns"
      :max-date="new Date()"
      expanded
      :locale="useI18n().locale.value"
      :attributes="[
        {
          key: 'today',
          content: 'orange',
          dates: new Date(),
        },
      ]"
    />
  </div>
</template>
<script setup lang="ts">
import { useElementSize } from '@vueuse/core'

const calendar = ref(null)
const { width } = useElementSize(calendar)
const columns = computed(() => width.value < 540 ? 1 : 2)

defineProps<{
  modelValue: string;
  name?: string;
  label?: string;
}>();
const emit = defineEmits(['update:modelValue']);
const updateModelValue = (value: Date) => {
  emit('update:modelValue', value ? getISODate(value) : undefined);
};
</script>
<style lang="scss">
.vc-weekdays {
  .vc-weekday {
    color: var(--color-gray-200);
  }
}

.vc-container .vc-highlights ~ .vc-day-content {
  color: white;
}
</style>
