<template>
  <ul
    class="peer-focus:none absolute bg-white rounded-b-lg ring-1 ring-primary-500 z-10 max-h-64 overflow-y-auto"
    v-if="filteredAirports.length"
    ref="list"
  >
    <li
      v-for="(airport, i) in filteredAirports"
      :key="airport.iata"
      :name="airport.iata"
      class="flex gap-2 text-base leading-none p-3 cursor-pointer hover:bg-primary-50 last:rounded-b-lg focus-within:outline-none focus-within:bg-primary-50 focus-within:text-primary-600"
      :class="{
        'bg-primary-50': i === selected,
      }"
      @mousedown.prevent="clickHandler(airport)"
      :ref="`item-${i}`"
    >
      <FontAwesomeIcon
        icon="plane"
        class="icon"
        :class="{
          'text-primary-600': i === selected,
          'text-gray-500': i !== selected,
        }"
      />
      <div class="flex flex-col gap-1">
        <span
          class="algolia-result"
          v-html="airport._highlightResult?.full.value"
          :class="{
            'text-primary-600': i === selected,
          }"
        />
        <span
          class="algolia-result text-sm leading-none text-neutral-500"
          v-html="
            [
              airport._highlightResult?.city.value,
              airport.countryName?.[$i18n.locale] ||
                countries.getName(airport.country, $i18n.locale),
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
    selected: {
      type: Number,
      default: 0,
    },
    query: {
      type: String,
      required: true,
    },
    limit: {
      type: Number,
      default: 10,
    },
  },
  data() {
    return {
      countries,
      filteredAirports: [] as Airport[],
    };
  },
  watch: {
    selected() {
      const el = this.$refs[
        `item-${this.selected}`
      ] as HTMLCollectionOf<HTMLElement>;
      if (el && this.$refs.list) {
        el[0].scrollIntoView({ behavior: "smooth", block: "nearest" })
      }
    },
    filteredAirports: {
      handler(val) {
        this.$emit("airports", val);
      },
      immediate: true,
    },
    query() {
      if (this.query.length < 1) return;
      this.search({ query: this.query, hitsPerPage: 10 }).then(({ hits }) => {
        this.filteredAirports = hits as Airport[];
        hits.forEach((hit: Airport, i: number) => {
          const a = { ...hit };
          delete a._highlightResult;
          delete a.objectID;
          this.$state.airports[hit.iata] = a;
        });
      });
    },
  },
  methods: {
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
    },
    scrollParentToChild(parent, child) {
      // Where is the parent on page
      var parentRect = parent.getBoundingClientRect();
      // What can you see?
      var parentViewableArea = {
        height: parent.clientHeight,
        width: parent.clientWidth,
      };

      // Where is the child
      var childRect = child.getBoundingClientRect();
      // Is the child viewable?
      var isViewable =
        childRect.top >= parentRect.top &&
        childRect.bottom <= parentRect.top + parentViewableArea.height;

      // if you can't see the child try to scroll parent
      if (!isViewable) {
        // Should we scroll using top or bottom? Find the smaller ABS adjustment
        const scrollTop = childRect.top - parentRect.top;
        const scrollBot = childRect.bottom - parentRect.bottom;
        if (Math.abs(scrollTop) < Math.abs(scrollBot)) {
          // we're near the top of the list
          parent.scrollTop += scrollTop;
        } else {
          // we're near the bottom of the list
          parent.scrollTop += scrollBot;
        }
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
