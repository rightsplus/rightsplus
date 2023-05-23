<template>
  <div class="grid grid-cols-1 lg:grid-cols-5 gap-5">
    <Stepper
      :steps="steps"
      :step="$state.claims.step"
      @setStep="$state.claims.step = $event"
    />
    <div
      class="container lg:col-span-3 bg-white rounded-2xl md:rounded-3xl p-5 md:p-12"
      :style="`--height: ${containerHeight}px`"
      ref="container"
    >
      <ClientOnly
        ><Transition mode="out-in" name="fade"
          ><component
            v-if="$state.claims"
            v-model="$state.claims"
            :is="activeStep?.component"
            :title="activeStep?.title"
            @submit="next"
            @back="back"
            @reset="reset"
        /></Transition>
      </ClientOnly>
    </div>

		<!-- <pre>{{ useFlightStatus(useAppState().claims.flight) }}</pre> -->
    <div class="flex flex-col gap-3">
      <Transition mode="out-in" name="fade">
      <div
        v-if="$state.claims.flight && $state.claims.step > 1"
        class="flex flex-col gap-2 bg-neutral-100 rounded-xl w-full p-4 px-5"
        v-bind="$attrs"
      >
        <PotentialClaims />
      </div>
    </Transition>
      <!-- <span class="font-bold">Dein Flug</span> -->
      <!-- <TransitionGroup
        tag="div"
        name="new-list"
        class="relative flex flex-col gap-5"
        :show="$state.claims.flight"
      >
        <RouteCard
          :route="route"
        />
      </TransitionGroup> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { FormKit } from "@formkit/vue";
import FlightByAirport from "./Forms/FlightByAirport.vue";
import ConnectingFlights from "./ConnectingFlights.vue";
import TransitionGroup from "@/components/cells/TransitionGroup.vue";
import FlightDate from "./FlightDate.vue";
import SelectFlight from "./SelectFlight.vue";
import PersonalInfo from "./PersonalInfo.vue";
import SelectReason from "./SelectReason.vue";
import Results from "./Results.vue";
import Reset from "./Reset.vue";
import Stepper from "@/components/cells/Stepper.vue";
import FlightResult from "./FlightResult.vue";
import RouteCard from "./RouteCard.vue";
import PotentialClaims from "@/components/cells/PotentialClaims.vue";

const steps = [
  {
    label: "Strecke",
    title: "Wohin bist du geflogen?",
    component: ConnectingFlights
  },
  {
    label: "Flug",
    title: "Welchen Flug hast du genommen?",
    component: SelectFlight
  },
  {
    label: "Grund",
    title: "Was ist schief gelaufen?",
    component: SelectReason
  },
  {
    label: "Passagiere",
    title: "Wer ist mitgeflogen?",
    component: PersonalInfo
  },
  // {
  //   label: "Results",
  //   component: Results
  // },
]
const containerHeight = ref(100);
const activeStep = computed(() => steps[useAppState().claims?.step || 0])

const next = (e?: number) => {
  useAppState().claims.step = e ?? useAppState().claims.step + 1;
}
const back = (e?: number) => {
  useAppState().claims.step = e ?? useAppState().claims.step - 1;
}
const reset = (e?: number) => {
  useAppState().claims.step = e ?? 0;
}


// watch(
//   () => useAppState().claims?.step,
//   () => setTimeout(setHeight, 0)
// );
// const setHeight = () => {
//   const childrenHeight = Math.min(
//     window.innerHeight - 120,
//     Math.max(
//       100,
//       ((this.$refs.container as HTMLElement)?.children[0]?.offsetHeight ||
//         0) + 80
//     )
//   );
//   this.containerHeight = (
//     this.$refs.container as HTMLElement
//   )?.children[0]?.offsetHeight;
// }
</script>
<style scoped>
.container {
  min-height: 100px;
  /* height: var(--height, initial); */
  /* box-sizing: content-box; */
  transition: height 1s cubic-bezier(0.5, 0, 0, 1);
  /* overflow-y: auto; */
}
</style>
