<template>
  <div
    class="container bg-white rounded-3xl p-5 sm:p-12"
    :style="`--height: ${containerHeight}px`"
    ref="container"
  >
    <component
      :is="activeComponent"
      v-model="form"
      @submit="step++"
      @back="step--"
      @reset="step = 0"
    ></component>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { FormKit } from "@formkit/vue";
import { Flight } from "@/types";
import Index from "./Index.vue";
import ConnectingFlights from "./ConnectingFlights.vue";
import SelectFlight from "./SelectFlight.vue";
import SelectReason from "./SelectReason.vue";
import Results from "./Results.vue";
import Reset from "./Reset.vue";

export default defineComponent({
  components: {
    FormKit,
    Index,
    ConnectingFlights,
    SelectFlight,
    SelectReason,
    Results,
    Reset,
  },
  data() {
    return {
      step: 0,
      containerHeight: 100,
      form: {
        departure: "SFO",
        arrival: "DFW",
        flightDate: "2019-12-12",
        connectingFlights: [] as any[] | boolean,
        selectedFlight: null as Flight | null,
        reason: null as string | null,
        actualArrivalTime: "2019-12-12T12:00" as string | null,
      },
    };
  },
  computed: {
    activeComponent() {
      switch (this.step) {
        case 0:
          return Index;
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
    });
  },
  watch: {
    step() {
      setTimeout(this.setHeight, 0);
    },
  },
  methods: {
    setHeight() {
      console.log((this.$refs.container as HTMLElement)?.children);
        const childrenHeight = Math.min(
        window.innerHeight - 120,
        Math.max(
          100,
          ((this.$refs.container as HTMLElement)?.children[0]?.offsetHeight || 0) + 80
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
