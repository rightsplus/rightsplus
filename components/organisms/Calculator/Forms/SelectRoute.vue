<template>
  <div class="grid @md:grid-cols-2 gap-3 @container">
    <div
      v-for="([key, route], i) in Object.entries(routes)"
      :key="key"
      class="w-full flex flex-col gap-1"
      :class="{ 'col-span-full': Object.values(routes).length !== 2 }"
    >
      <ButtonRoute
        @click="
          () => {
            modelValue.route = key;
            assignRoute();
            $emit('select');
          }
        "
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

const { routes, assignRoute } = useFlightRoute(props.modelValue)

</script>
