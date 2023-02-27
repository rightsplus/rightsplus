<template>
  <div>
    <Stepper class="mb-5" :steps="steps" :step="$state.claims.step" />
    <div
      class="container bg-white rounded-3xl p-5 sm:p-12"
      :style="`--height: ${containerHeight}px`"
      ref="container"
    >
      <component
        :is="activeComponent"
        v-if="$state.claims"
        v-model="$state.claims"
        @submit="$state.claims.step++"
        @back="$state.claims.step--"
        @reset="$state.claims.step = 0"
      ></component>
      <!-- <pre class="text-sm">{{ $state.claims }}</pre> -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { FormKit } from "@formkit/vue";
import FlightByAirport from "./Forms/FlightByAirport.vue";
import ConnectingFlights from "./ConnectingFlights.vue";
import SelectFlight from "./SelectFlight.vue";
import SelectReason from "./SelectReason.vue";
import Results from "./Results.vue";
import Reset from "./Reset.vue";
import Stepper from "@/components/cells/Stepper.vue";

export default defineComponent({
  components: {
    FormKit,
    FlightByAirport,
    ConnectingFlights,
    SelectFlight,
    SelectReason,
    Results,
    Reset,
    Stepper,
  },
  data() {
    return {
      containerHeight: 100,
    };
  },
  computed: {
    steps() {
      const step = this.$state.claims?.step || 0
      return [
        {
          label: "Flight Info",
          active: 0,
        },
        {
          label: "Flight Disruption",
          active: 3,
        },
        {
          label: "Personal Info",
          active: 6,
        },
      ];
    },
    activeComponent() {
      const components = [
        FlightByAirport,
        ConnectingFlights,
        SelectFlight,
        SelectReason,
        Results,
        Reset,
      ];
      return components[this.$state.claims.step];
      switch (this.$state.claims.step) {
        case 0:
          return FlightByAirport;
        case 1:
          return ConnectingFlights;
        case 2:
          return SelectFlight;
        case 3:
          return SelectReason;
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
