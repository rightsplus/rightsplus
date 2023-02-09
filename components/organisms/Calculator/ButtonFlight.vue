<template>
  <button
    class="flex gap-5 items-center rounded-lg py-3 px-5"
    :class="{
      'bg-gray-700 text-white': isSelected,
      'bg-neutral-100 hover:bg-neutral-200 text-gray-800': !isSelected,
    }"
  >
    <div
      class="w-14 h-14 flex justify-center items-center bg-white rounded-full -ml-2"
    >
      <img
        :alt="flight.airline.name"
        :src="logo"
        class="w-10"
      />
    </div>
    <div class="flex flex-col items-start">
      <span class="text-lg font-bold flex items-center gap-3">{{ time(flight.departure.scheduled) }}<FontAwesomeIcon icon="plane" class="text-sm text-gray-400" />{{ time(flight.arrival.scheduled) }}</span>
      <span class="text-base">{{ flight.airline.name }}</span>
    </div>
    <span class="ml-auto text-gray-400 text-base font-medium">{{ iata }}</span>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ButtonBack from "@/components/molecules/ButtonBack.vue";
import { Flight } from "@/types";

export default defineComponent({
  components: {
    ButtonBack,
  },
  props: {
    selected: {
      type: Object as () => Flight,
    },
    flight: {
      type: Object as () => Flight,
      default: () => ({} as Flight),
    },
  },
  computed: {
    isSelected() {
      return this.selected?.flight?.iata === this.flight.flight.iata;
    },
    iata() {
      return this.flight.flight.iata.match(/[a-zA-Z]+|[0-9]+/g)?.join(' ');
    },
    logo() {
      // return `https://content.r9cdn.net/rimg/provider-logos/airlines/v/LY.png?crop=false&width=100&height=100`
      return `https://content.r9cdn.net/rimg/provider-logos/airlines/v/${this.flight.airline.iata}.png?crop=false&width=100&height=100`
      // return `https://serkowebtest.blob.core.windows.net/airline-logos/${airline}_1x.png`
    },
  },
  methods: {
    time(time: string) {
      return new Date(time).toLocaleTimeString(this.$i18n.locale, {
          hour: "2-digit",
          minute: "2-digit",
        })
    }
  }
});
</script>
