<template>
  <ul
    class="peer-focus:none absolute bg-white rounded-lg shadow-xl z-10 overflow-hidden"
    v-if="filteredAirports.length"
  >
    <li
      v-for="airport in filteredAirports"
      :key="airport.iata"
      class="flex gap-2 text-base leading-none p-3 cursor-pointer hover:bg-neutral-100"
      @mousedown="clickHandler(airport)"
    >
      <FontAwesomeIcon icon="plane" class="text-gray-500" />
      <div class="flex flex-col gap-1">
        <span
          class="algolia-result"
          v-html="airport._highlightResult.full.value"
        />
        <span class="algolia-result text-sm leading-none text-neutral-500"
        v-html="[airport._highlightResult.city.value,
        countries.getName(airport.countryCode, $i18n.locale)] .filter(Boolean)
        .join(', ')" />
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
    clickHandler(airport: Airport) {
      this.$emit("input", airport);
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
