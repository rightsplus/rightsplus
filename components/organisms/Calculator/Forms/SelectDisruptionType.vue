<template>
  <div class="grid gap-3 mt-5">
    <ButtonLarge
      v-for="c in availableDisruptions"
      :key="c.value"
      @click.prevent="handleSelect(c.value)"
      :selected="modelValue.disruption.type === c.value"
      :name="c.value"
      :label="c.label"
      :sub-label="c.sublabel"
      :icon="c.icon"
      proceed
    />
  </div>
</template>

<script setup lang="ts">
import DropdownButton from "@/components/molecules/DropdownButton.vue";
import ButtonLarge from "../ButtonLarge.vue";
import type { ClaimsForm } from "@/types";

const props = defineProps<{
  modelValue: ClaimsForm;
}>();
const emit = defineEmits(["select"]);
const claim = useClaim()
const { disruptions } = useDisruption();
const availableDisruptions = computed(() => {
  return disruptions.filter(({value}) => claim.flight?.status !== value)
})
const handleSelect = (value: ClaimsForm["disruption"]["type"]) => {
  props.modelValue.disruption.type = value;
  emit("select", value);
};

onMounted(() => {
  props.modelValue.disruption.type = null;
});
</script>
