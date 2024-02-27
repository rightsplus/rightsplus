import StepItinerary from "~/components/organisms/Calculator/StepItinerary.vue";
import StepDisruption from "~/components/organisms/Calculator/StepDisruption.vue";
import StepPassengers from "~/components/organisms/Calculator/StepPassengers.vue";
import StepCompleteSubmission from "~/components/organisms/Calculator/StepCompleteSubmission.vue";
import { claim } from "~/store";
import type { Airline, ClaimsForm } from "@/types";
import nuxtStorage from 'nuxt-storage';
import { euMember } from "is-european";

export interface Step {
  label: string;
  component: Component;
  emit?: string;
}
const index = ref(0)
const steps = computed<Step[]>(() => {
  const { airport } = claim.value as ClaimsForm

  return [
    {
      label: "Angaben zum Flug",
      component: StepItinerary,
    },
    {
      label: "Beschreibung des Vorfalls",
      component: StepDisruption,
    },
    {
      label: "Angaben zu den Passagieren",
      component: StepPassengers,
      emit: "submit",
    },
    {
      label: "Vervollständigung",
      component: StepCompleteSubmission
    },
  ]
})
const minmax = (value: number) => {
  return Math.min(Math.max(value, 0), steps.value.length - 1);
}
export const next = (e?: number) => {
  index.value = minmax(e ?? index.value + 1);
};
export const prev = (e?: number) => {
  index.value = minmax(e ?? index.value - 1);
};
export const reset = (e?: number) => {
  index.value = minmax(e ?? 0);
};
watch(() => index, ({ value }) => {
  nuxtStorage.localStorage.setData('rights-plus-step', value, 30);
}, { deep: true });

watch(() => { }, () => {
  if (process.client) {
    const value = nuxtStorage.localStorage.getData('rights-plus-step')
    if (value) index.value = value
  }
}, { immediate: true });
export const useSteps = () => ({ steps, index, step: computed(() => steps.value[index.value]) })

