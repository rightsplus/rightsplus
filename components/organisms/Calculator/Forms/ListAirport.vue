<template>
  <Dropdown
    v-if="inputFocused && query.length"
    :selected="selected"
    :limit="limit"
    :list="dropdownList"
    @input="clickHandler"
  />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { countries } from "@/config/countries";
import Dropdown, { DropdownItem } from "@/components/molecules/Dropdown.vue";
import { Airport } from "@/types";

const { locale } = useI18n();
const airports = useAirports();
const props = defineProps<{
  selected: number;
  query: string;
  limit: number;
  inputFocused: boolean;
}>();

const emit = defineEmits(["input", "airports"]);
const { search } = useAlgoliaSearch("AIRPORTS");
const filteredAirports = ref([] as Airport[]);
const dropdownList = ref([] as DropdownItem[])

const clickHandler = (index: number) => {
  const { iata, full, name, city, country, countryName, lat, lon } = [...filteredAirports.value][index];
  emit("input", {
    iata,
    full,
    name,
    city,
    country,
    countryName,
    lat,
    lon,
  });
};
watch(() => filteredAirports.value, (val) => {
  emit("airports", val);
}, { immediate: true });
watch(
  () => props.query,
  () => {
    if (props.query?.length < 1) return;
    search({ query: props.query, hitsPerPage: 10 }).then(({ hits }) => {
      dropdownList.value = hits.map((airport) => ({
        value: airport.iata,
        label: airport._highlightResult?.full.value || "Airport",
        sublabel: [
          airport._highlightResult?.city.value,
          airport.countryName?.[locale.value] ||
            countries.getName(airport.country, locale.value),
        ]
          .filter(Boolean)
          .join(", "),
        icon: "plane",
      }));
      filteredAirports.value = hits as Airport[];
      hits.forEach((hit: Airport, i: number) => {
        const a = { ...hit };
        delete a._highlightResult;
        delete a.objectID;
        airports.value[hit.iata] = a;
      });
    });
  }
);
</script>
<style scoped>
.algolia-result::v-deep(em) {
  font-style: normal;
  font-weight: bold;
}
</style>
