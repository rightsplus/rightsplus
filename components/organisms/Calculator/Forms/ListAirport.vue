<template>
  <ul
    class="peer-focus:none absolute bg-white rounded-lg shadow-xl z-10 overflow-hidden"
    v-if="filteredAirports.length"
  >
    <li
      v-for="airport in filteredAirports"
      :key="airport.value"
      class="flex gap-2 text-base leading-none p-3 cursor-pointer hover:bg-neutral-100"
      @mousedown="clickHandler(airport)"
    >
      <FontAwesomeIcon icon="plane" class="text-gray-500" />
      <div class="flex flex-col gap-1">
        <span
          >{{ airport.name }} (<span class="font-bold">{{ airport.iata }}</span
          >)</span
        >
        <span class="text-sm leading-none text-neutral-500">{{
          [airport.city, countries.getName(airport.countryCode, $i18n.locale)]
            .filter(Boolean)
            .join(", ")
        }}</span>
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
    };
  },
  computed: {
    filteredAirports() {
      if (typeof this.$state.airports?.search !== 'function') return [];
      return this.$state.airports?.search(this.query).slice(0, this.limit);
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    clickHandler(airport: Airport) {
      this.$emit("input", airport);
    },

    init() {
      if (this.$state.airports.size) return;
      this.$state.airports = new TrieSearch(
        ["iata", "name", "city", "country", "full"],
        { min: 2 }
      );
      fetch(
        "https://cors-anywhere.herokuapp.com/https://raw.githubusercontent.com/mwgg/Airports/master/airports.json"
      )
        .then((response) => response.json())
        .then((data: Record<string, Airport>) => {
          const raw = Object.values(data).reduce(
            (acc: Airport[], { name, iata, city, country }: Airport) => {
              return iata
                ? [
                    ...acc,
                    {
                      full: `${name} (${iata})`,
                      name,
                      iata,
                      city,
                      countryCode: country,
                      country: countries.getName(
                        country || "",
                        this.$i18n.locale
                      ),
                    },
                  ]
                : acc;
            },
            []
          );
          console.log(raw);
          this.$state.airports.addAll(raw);
        })
        .catch((error) => {
          this.$state.airports.add({
            name: "Error with Server Request",
            iata: "ERR",
            city: "Error",
            country: "Error",
          });
        });
      }
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
