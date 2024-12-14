<template>
  <Transition name="slide-in" style="--offset: 300px" class="">
    <div
      v-if="show"
      class="duration-500 z-50 fixed top-auto inset-0 m-3 sm:m-5"
    >
      <div
        class="flex flex-col gap-3 max-w-3xl mx-auto rounded-3xl bg-white shadow-xl ease-out p-5"
      >
        <div class="flex items-baseline justify-between gap-2">
          <span class="text-lg font-medium sm:hidden leading-tight">
            {{ t('compensationBanner.claimUpTo', { amount: n(600, 'currency', { maximumFractionDigits: 0 }) }) }}
          </span>
          <button
            @click.prevent="seen = true"
            class="leading-none text-xl sm:text-2xl self-start"
            :aria-label="t('compensationBanner.close')"
          >
            <FontAwesomeIcon icon="times" />
          </button>
        </div>
        <div class="grid sm:flex gap-5 gap-x-8 items-end">
          <div class="grow hidden sm:grid gap-2">
            <span class="text-xl sm:text-2xl font-bold leading-tight">
              {{ t('compensationBanner.claimUpToExtended', { amount: n(600, 'currency', { maximumFractionDigits: 0 }) }) }}
            </span>
          </div>
          <Button
            @click.prevent="start"
            primary
            suffixIcon="angle-right"
            class="shrink-0"
            >{{ t('checkClaim') }}</Button
          >
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import claimMachine from "~/machines/claimSubmission";
import AirportInput from "./AirportInput.vue";
import type { ClaimState, ClaimsForm } from "@/types";
import Button from "@/components/core/Button.vue";

const { t, n } = useI18n();
const emit = defineEmits(["submit"]);
const { push } = useRouter();
const claimState = useClaim();
const { invoke } = useMachine<ClaimState, ClaimsForm>(claimMachine, {
  context: claimState,
});
const localePath = useLocalePath();
const start = () => {
  invoke("reset");
  push(localePath("new-claim"));
};
const scroll = useScroll();
const show = computed(
  () =>
    !seen.value &&
    scroll.value > window?.innerHeight &&
    scroll.value < document.body.scrollHeight - window?.innerHeight * 2
);
const seen = ref(false);
</script>
