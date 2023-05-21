<template>
  <!-- <pre>{{$state.claims}}</pre> -->
  <div class="flex flex-col gap-5" v-if="Object.keys($state.routes).length">
    <h1 class="text-3xl font-bold">Du hast Anspruch auf Entschädigung!</h1>
    <div>{{ getAirportDistance($state.claims.airport.departure, $state.claims.airport.arrival) }}</div>
      <FlightResult :flight="$state.claims.flight" />
      <NavigationButtons @previous="$emit('back')" @next="$emit('submit')" />

      <!-- <p><b>Außergewöhlicher Umstand:</b> {{ route.flight?.extraordinaryCircumstances }}</p>
      <p><b>Verjährt:</b> {{ barred ? `Ja (${barred})` : "Nein" }}</p>
      <p><b>Mindestens 3h Verspätet:</b> {{ (route.flight?.departure.delay || 0) / 60 > 3 }}</p>
      <p><b>Fluggesellschaft in EU:</b> {{ airlines[route.flight?.airline.iata]?.isEuMember }} ({{airlines[route.flight?.airline.iata]?.nameCountry}})</p>
      <p><b>Abflug in EU:</b> {{ euLabel($state.claims?.airport.departure?.country) }}</p>
      <p><b>Landung in EU:</b> {{ euLabel($state.claims?.airport.arrival?.country) }}</p>
      <p><b>Distanz:</b> {{ $n(route.flight?.distance || 0, "km") }}</p> -->
      <!-- <pre>{{ $state.claims }}</pre> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Button from "@/components/molecules/Button.vue";
import ButtonBack from "@/components/molecules/ButtonBack.vue";
import { getAirportDistance } from "@/utils";
import { Flight } from "@/types";
import { euMember } from "is-european";
import FlightResult from "./FlightResult.vue";
import NavigationButtons from "./NavigationButtons.vue";

export default defineComponent({
  components: {
    Button,
    ButtonBack,
    FlightResult,
    NavigationButtons
  },
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      value: null,
      airlines: {},
    };
  },
  mounted() {
    fetch("api/airlines-aviation-edge.json")
      .then((data) => data.json())
      .then((data ) => {
        this.airlines = data
        this.airlines = data.reduce((acc, cur) => {
          acc[cur.codeIataAirline] = {
            // ...cur,
            name: cur.nameAirline,
            nameCountry: cur.nameCountry,
            country: cur.codeIso2Country,
            iata: cur.codeIataAirline,
            isEuMember: euMember(cur.codeIso2Country),
          };
          return acc;
        }, {})
      })
  },
  computed: {
    barred() {
      // @todo better to use arrival date
      const d = this.$state.claims?.date.departure
      return d && new Date().getFullYear() - new Date(d).getFullYear() > 3 ? new Date(d).getFullYear() : false
    }
  },
  methods: {
    isEuMember,
    euLabel(country: string) {
      return euMember(country) ? `Ja (${country})` : `Nein (${country})`;
    },
    getAirportDistance,
    submitHandler() {
      this.$emit("submit");
      return;
    },
  },
});
</script>
<style scoped>
.double {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.triple {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
</style>
