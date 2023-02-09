<template>
  <ul
    class="peer-focus:none absolute bg-white rounded-lg shadow-xl z-10 overflow-hidden p-[1px]"
    v-if="filteredAirports.length"
    @blur="$emit('blur')"
  >
    <li
      v-for="airport, i in filteredAirports"
      :tabindex="i"
      :key="airport.iata"
      :name="airport.iata"
      class="flex gap-2 text-base leading-none p-3 cursor-pointer hover:bg-neutral-100 first:rounded-t-lg last:rounded-b-lg focus-within:outline-none focus-within:ring-1 focus-within:ring-primary-500 focus-within:bg-neutral-100"
      @mousedown="clickHandler(airport)"
      @keydown.up.prevent="previous"
      @keydown.down.prevent="next"
      @keydown.enter.prevent="clickHandler(airport)"
      @keydown.space.prevent="clickHandler(airport)"
      @blur="blur"
    >
      <FontAwesomeIcon icon="plane" class="text-gray-500" />
      <div class="flex flex-col gap-1">
        <span
          class="algolia-result"
          v-html="airport._highlightResult?.full.value"
        />
        <span
          class="algolia-result text-sm leading-none text-neutral-500"
          v-html="
            [
              airport._highlightResult?.city.value,
              airport.countryName?.[$i18n.locale] || countries.getName(airport.country, $i18n.locale),
            ]
              .filter(Boolean)
              .join(', ')
          "
        />
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { FormKit } from "@formkit/vue";
import TrieSearch from "trie-search";
import { countries } from "@/config/countries";

import { Airport } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default defineComponent({
  setup() {
    const { result, search } = useAlgoliaSearch("AIRPORTS");
    return {
      result,
      search,
    };
  },
  components: {
    FormKit,
    FontAwesomeIcon,
  },
  props: {
    query: {
      type: String,
      required: true,
    },
    limit: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      countries,
      filteredAirports: [] as Airport[],
    };
  },
  watch: {
    query() {
      this.search({ query: this.query, hitsPerPage: 5 }).then(({ hits }) => {
        this.filteredAirports = hits as Airport[];
      });
    },
  },
  methods: {
    blur(e) {
      if (e.relatedTarget?.nodeName !== "LI") this.$emit('blur')
    },
    next() {
      const active = document.activeElement;
      if (active?.nextElementSibling) {
        (active.nextElementSibling as HTMLElement).focus();
      }
    },
    previous() {
      const active = document.activeElement;
      if (active?.previousElementSibling) {
        (active.previousElementSibling as HTMLElement).focus();
      }
    },
    selectAirport(airport: Airport) {
      const { iata, full, name, city, country, countryName, lat, lon } =
        airport;
      this.$emit("input", {
        iata,
        full,
        name,
        city,
        country,
        countryName,
        lat,
        lon,
      });
    },
    clickHandler(airport: Airport) {
      this.selectAirport(airport);
      if (document.activeElement) {
        (document.activeElement as HTMLElement).blur();
      }
    },
  },
});
</script>
<style scoped>
.algolia-result::v-deep(em) {
  font-style: normal;
  font-weight: bold;
}
</style>
