<template>
  <div ref="calendar">
    <DatePicker
      :modelValue.string="modelValue"
      @update:modelValue="updateModelValue"
      @dayclick="dayClick"
      @update:pages="$emit('update:page', $event)"
      :masks="{ modelValue: 'DD.MM.YYYY' }"
      class="calendar"
      color="orange"
      :step="1"
      :columns="columns"
      :min-date="minDate ? new Date(minDate) : undefined"
      :max-date="new Date()"
      expanded
      :locale="useI18n().locale.value"
      is-required
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
import { DatePicker } from 'v-calendar';
import 'v-calendar/dist/style.css';

const calendar = ref(null)
const { width } = useElementSize(calendar)
const columns = computed(() => width.value < 540 ? 1 : 2)

const props = defineProps<{
  modelValue: string | null;
  minDate?: string | Date;
  name?: string;
  label?: string;
}>();
const emit = defineEmits(['update:modelValue', 'update:page', 'select']);
const updateModelValue = (value?: Date) => {
  emit('update:modelValue', value ? getISODate(value) : undefined);
};
const dayClick = (value: Date) => {
  emit('select')
};
 onMounted(() => {
  if (!props.modelValue) updateModelValue()
 })
</script>
<style lang="postcss">
.vc-weekdays .vc-weekday {
  @apply text-gray-300
}

.vc-container .vc-highlights ~ .vc-day-content {
  @apply text-white
}
.vc-header .vc-next, .vc-header .vc-prev {
  @apply w-7 h-7
}
.vc-title:focus-visible {
  @apply ring-1 ring-primary-500 ring-offset-2
}
.vc-focus:focus-visible, .vc-focus:focus-within {
  @apply focus-within:ring-1 ring-primary-500 ring-offset-2
}
.vc-focus:focus-within:not(:focus-visible):has(svg) {
  @apply !ring-transparent
}
</style>
