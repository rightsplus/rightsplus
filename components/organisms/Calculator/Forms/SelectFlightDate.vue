<template>
  <InputDate
    v-model="modelValue.date"
    @select="$emit('select')"
    :minDate="minDate"
  />
  <span class="text-xs text-gray-400 font-medium"
    >Flüge vor dem {{ minDate.toLocaleDateString() }} sind verjährt.</span
  >
</template>

<script setup lang="ts">
import type { ClaimsForm } from "@/types";
import InputDate from "@/components/molecules/InputDate.vue";
const props = defineProps<{
  modelValue: ClaimsForm;
}>();
const minDate = computed(() => new Date(new Date().getFullYear() - 3, 0));
onMounted(() => {
  props.modelValue.date = null
})
</script>
