import ConnectingFlights from "~/components/organisms/Calculator/ConnectingFlights.vue";
import PersonalInfo from "~/components/organisms/Calculator/PersonalInfo.vue";
import SelectFlight from "~/components/organisms/Calculator/SelectFlight.vue";
import SelectReason from "~/components/organisms/Calculator/SelectReason.vue";
import { claim } from "~/store";
import type { Airline, ClaimsForm } from "@/types";
import nuxtStorage from 'nuxt-storage';
import { euMember } from "is-european";

export interface Step {
  label: string,
  title: string,
  component: Component,
}
const index = ref(0)
const steps = computed<Step[]>(() => {
  const { airport, route, flight_date, flight, disruption, client } = claim.value as ClaimsForm
  const routes = generateRoutes(airport.trip)

  return [
    {
      label: "Strecke",
      title: "Wohin bist du geflogen?",
      component: ConnectingFlights,
    },
    {
      label: "Flug",
      title: "Flug wählen",
      component: SelectFlight,
    },
    {
      label: "Grund",
      title: "Was ist schief gelaufen?",
      component: SelectReason,
    },
    {
      label: "Passagiere",
      title: "Wer ist mitgeflogen?",
      component: PersonalInfo,
    },
    // {
    //   label: "Results",
    //   component: Results
    // },
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

