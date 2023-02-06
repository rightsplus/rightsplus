<template>
  <button
    class="flex gap-5 items-center rounded-lg p-3 px-5"
    :class="{
      'bg-gray-700 text-white': isSelected,
      'bg-neutral-100 hover:bg-neutral-200 text-gray-800': !isSelected,
    }"
  >
    <div
      class="w-10 h-10 flex justify-center items-center bg-white rounded-full"
    >
      <img
        :alt="flight.airline.name"
        :src="`${baseUrl}/${flight.airline.iata}_1x.png`"
        class="w-7"
      />
    </div>
    <div class="flex flex-col items-start">
      <span class="text-lg font-bold">{{ time }}</span>
      <span class="text-base">{{ flight.airline.name }}</span>
    </div>
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
  data() {
    return {
      baseUrl: "https://serkowebtest.blob.core.windows.net/airline-logos",
    };
  },
  computed: {
    isSelected() {
      return this.selected?.flight?.iata === this.flight.flight.iata;
    },
    time() {
      return new Date(this.flight.departure.scheduled).toLocaleTimeString(this.$i18n.locale, {
          hour: "2-digit",
          minute: "2-digit",
        })
    }
  }
});
</script>
