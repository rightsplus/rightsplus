<template>
  <div class="grid gap-5 w-full">
    <div class="flex flex-col items-start gap-2">
      <!-- {{ state.value }} -->
      <div class="flex flex-col gap-2 w-full" v-if="loading">
        <span class="bg-gray-200 rounded w-48 h-8 mt-1" />
        <span class="bg-gray-200 rounded w-96 h-5 max-w-full" />
      </div>
      <div class="flex flex-col gap-2" v-else>
        <h2 class="text-3xl sm:text-4xl font-bold" :key="state.value">
          {{ title || t(state.value + ".title") }}
        </h2>
        <h3
          class="text-base sm:text-lg leading-tight sm:leading-tight"
          :key="state.value"
        >
          {{ description || t(state.value + ".description") }}
        </h3>
      </div>
    </div>
    <div class="w-full">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import claimMachine from "~/machines/claimSubmission";
import type { ClaimsForm, ClaimState } from "~/types";
const loading = ref(true);
defineProps<{
  title?: string;
  description?: string;
}>();
const { t } = useI18n();
const claim = useClaim();
const { state } = useMachine<ClaimState, ClaimsForm>(claimMachine, {
  context: claim,
});
onMounted(() => (loading.value = false));
</script>
