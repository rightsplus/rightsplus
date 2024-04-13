<template>
  <div class="grid @md:grid-cols-2 gap-3 @container">
    <div
      v-for="([key, leg], i) in Object.entries(legs)"
      :key="key"
      class="w-full flex flex-col gap-1"
      :class="{ 'col-span-full': Object.values(legs).length !== 2 }"
    >
      <ButtonLeg
        @click="
          () => {
            modelValue.leg = key;
            assignLeg();
            $emit('select');
          }
        "
        :leg="leg"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ClaimsForm } from "@/types";
import ButtonLeg from "../ButtonLeg.vue";
const props = defineProps<{
  modelValue: ClaimsForm;
}>();

const { legs, assignLeg } = useFlightLeg(props.modelValue)

</script>
