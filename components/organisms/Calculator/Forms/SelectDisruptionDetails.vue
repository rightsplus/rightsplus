<template>
    <div class="grid gap-3">
      <ButtonLarge
        v-for="c in type === 'cancelled' ? cancelledDetails : delayedDetails"
        :key="c.value"
        @click.prevent="
          () => {
            modelValue.disruption.details = c.value;
            $emit('select');
          }
        "
        :selected="modelValue.disruption.details === c.value"
        :name="c.value"
        :label="c.label"
        :preLabel="c.preLabel"
        proceed
      />
  </div>
</template>

<script setup lang="ts">
import ButtonLarge from "@/components/organisms/Calculator/ButtonLarge.vue";
import type { ClaimsForm } from "@/types";

const props = defineProps<{
  modelValue: ClaimsForm;
  type: "cancelled" | "delayed";
}>();

const { delayedDetails, cancelledDetails } = useDisruption();
onMounted(() => {
  props.modelValue.disruption.details = null;
});
</script>
