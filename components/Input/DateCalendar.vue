<template>
  <Dropdown :distance="6" :delay="0" class="w-full">
    <InputDate
      :modelValue="date"
      @update:modelValue="date = $event"
      v-bind="$attrs"
    />
    <template #popper>
      <!-- :minDate="minDate" -->
      <InputCalendar
        :modelValue.string="date"
        @update:modelValue="date = $event"
        borderless
        @select="() => $emit('select')"
        @update:page="($event) => $emit('update:page', $event)"
        v-bind="$attrs"
      />
    </template>
  </Dropdown>
</template>
<script lang="ts" setup>
import { Dropdown } from "floating-vue";
import "floating-vue/dist/style.css";
const date = defineModel<string>({ required: true });
defineProps<{ minDate?: string | Date }>();
defineEmits(["select", "update:page"]);
</script>
