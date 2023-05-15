<template>
  <DatePicker
    :modelValue.string="modelValue"
    @update:modelValue="updateModelValue"
    :masks="{modelValue: 'DD.MM.YYYY'}"
    class="calendar"
    color="orange"
    :columns="columns"
    :max-date="new Date()"
    expanded
    :attributes="[
      {
        key: 'today',
        content: 'orange',
        dates: new Date(),
      },
    ]"
  />
</template>
<script setup lang="ts">
import { useScreens } from 'vue-screen-utils';

const { mapCurrent } = useScreens({
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
});
const columns = mapCurrent({ lg: 2 }, 1);
const props = defineProps<{
  modelValue: string;
  name?: string;
  label?: string;
}>();
const emit = defineEmits(['update:modelValue']);
const updateModelValue = (value: Date) => {
  const offset = value.getTimezoneOffset()
  value = new Date(value.getTime() - (offset*60*1000))
  emit('update:modelValue', value.toISOString().split('T')[0]);
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
