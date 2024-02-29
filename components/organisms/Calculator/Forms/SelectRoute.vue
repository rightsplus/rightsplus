<template>
  <div class="grid @md:grid-cols-2 gap-5 @container">
    <div
      v-for="([key, route], i) in Object.entries(routes)"
      :key="key"
      class="w-full flex flex-col gap-3"
      :class="{ 'col-span-full': Object.values(routes).length !== 2 }"
    >
      <ButtonRoute
        :selected="modelValue.route === key"
        @click="modelValue.route = key"
        :route="route"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ClaimsForm } from "@/types";
import ButtonRoute from "../ButtonRoute.vue";

const props = defineProps<{
  modelValue: ClaimsForm;
}>();
const routes = computed(() => generateRoutes?.(props.modelValue.airport.trip));

</script>
