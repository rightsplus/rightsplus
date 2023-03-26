<template>
  <div class="grid grid-cols-1 sm:grid-cols-5 gap-5">
    <Stepper
      class="mb-5"
      :steps="steps"
      :step="$state.claims.step"
      @setStep="$state.claims.step = $event"
    />
    <div
      class="container sm:col-span-3 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-12"
      :style="`--height: ${containerHeight}px`"
      ref="container"
    >
      <ClientOnly
        ><Transition mode="out-in" name="fade"
          ><component
            :is="activeComponent"
            v-if="$state.claims"
            v-model="$state.claims"
            @submit="next"
            @back="back"
            @reset="reset"
        /></Transition>
      </ClientOnly>
    </div>
    <div class="flex flex-col gap-3">
  <div
    class="flex flex-col gap-2 bg-neutral-100 rounded-xl w-full p-4 px-5"
    v-bind="$attrs"
  >
  Deine Ansprüche
    </div>
    <span class="font-bold">Deine Flüge</span>
      <TransitionGroup
        tag="div"
        name="new-list"
        class="relative flex flex-col gap-5"
      >
        <RouteCard
          v-if="$state.routes"
          v-for="([key, route], i) in Object.entries($state.routes)"
          :key="route.departure.airport?.iata"
          :route="route"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { FormKit } from "@formkit/vue";
import FlightByAirport from "./Forms/FlightByAirport.vue";
import ConnectingFlights from "./ConnectingFlights.vue";
import FlightDate from "./FlightDate.vue";
import SelectFlight from "./SelectFlight.vue";
import PersonalInfo from "./PersonalInfo.vue";
import SelectReason from "./SelectReason.vue";
import Results from "./Results.vue";
import Reset from "./Reset.vue";
import Stepper from "@/components/cells/Stepper.vue";
import FlightResult from "./FlightResult.vue";
import RouteCard from "./RouteCard.vue";

export default defineComponent({
  components: {
    FormKit,
    FlightByAirport,
    ConnectingFlights,
    FlightDate,
    SelectFlight,
    SelectReason,
    PersonalInfo,
    Results,
    Reset,
    Stepper,
    FlightResult,
    RouteCard,
  },
  data() {
    return {
      containerHeight: 100,
    };
  },
  computed: {
    steps() {
      const step = this.$state.claims?.step || 0;
      return [
        {
          label: "Flugroute",
          active: 0,
        },
        {
          label: "Flüge",
          active: 1,
        },
        {
          label: "Reason for Disruption",
          active: 2,
        },
        {
          label: "Personal",
          active: 3,
        },
        {
          label: "Results",
          active: 4,
        },

        // {
        //   label: "Flight Info",
        //   active: 0,
        // },
        // {
        //   label: "Flight Disruption",
        //   active: 4,
        // },
        // {
        //   label: "Personal Info",
        //   active: 7,
        // },
      ];
    },
    activeComponent() {
      switch (this.$state.claims?.step || 0) {
        case 0:
          return ConnectingFlights;
        case 1:
          return SelectFlight;
        case 2:
          return SelectReason;
        case 3:
          return PersonalInfo;
        case 4:
          return Results;
        default:
          return Reset;
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.setHeight();
      if (!this.$state.claims?.step) {
        this.$state.claims.step = 0;
      }
    });
  },
  watch: {
    step() {
      setTimeout(this.setHeight, 0);
    },
  },
  methods: {
    next(e?: number) {
      this.$state.claims.step = e ?? this.$state.claims.step + 1;
    },
    back(e?: number) {
      this.$state.claims.step = e ?? this.$state.claims.step - 1;
    },
    reset(e?: number) {
      this.$state.claims.step = e ?? 0;
    },
    setHeight() {
      const childrenHeight = Math.min(
        window.innerHeight - 120,
        Math.max(
          100,
          ((this.$refs.container as HTMLElement)?.children[0]?.offsetHeight ||
            0) + 80
        )
      );
      this.containerHeight = (
        this.$refs.container as HTMLElement
      )?.children[0]?.offsetHeight;
    },
  },
});
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
